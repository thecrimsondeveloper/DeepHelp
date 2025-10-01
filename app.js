/*
 * NexusAI Web Validator
 * All API constants, DTO definitions, and helpers are centralized here.
 */

const NxConstants = {
  baseUrl: 'https://generativelanguage.googleapis.com',
  routeTemplate: '/v1beta/models/{model}:generateContent',
  headerKeyName: 'x-goog-api-key',
  queryKeyName: 'key',
  // Default models for each mode
  models: {
    image: 'gemini-2.5-flash-image-preview',
    text: 'gemini-2.5-flash'
  },
  defaultSafetyFilterLevel: 'block_only_illegal',
  maxRetries: 3,
  retryDelays: [1000, 2000, 4000],
  jitterMin: 100,
  jitterMax: 300,
  defaultTimeout: 30000,
  // Regex used to fallback parse for mimeType & data pairs
  mimeDataRegex: /"mimeType"\s*:\s*"([^"\\]+)"\s*,\s*"data"\s*:\s*"([^"\\]+)"/g,
  strings: {
    idle: 'Idle',
    generating: 'Generating…',
    retrying: 'Retrying…',
    cancelled: 'Canceled'
  }
};

// Global application state
const state = {
  results: [],
  abortController: null,
  timerId: null,
  startTime: 0,
  generating: false
};

// Short utility functions
function maskKey(key) {
  if (!key) return '';
  const len = key.length;
  if (len <= 6) return '*'.repeat(len);
  return key.slice(0, 4) + '*'.repeat(len - 6) + key.slice(len - 2);
}

function sanitizeFilename(str) {
  return str ? str.replace(/[^a-zA-Z0-9_\-]/g, '') : '';
}

function fixBase64(base64) {
  if (!base64) return '';
  let s = base64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad === 2) s += '==';
  else if (pad === 3) s += '=';
  else if (pad === 1) s += '===';
  return s;
}

function base64ToBlob(base64, mimeType) {
  const fixed = fixBase64(base64);
  const binary = atob(fixed);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}

function loadKeyFromStorage() {
  try {
    return localStorage.getItem('nexusai_api_key') || '';
  } catch (e) {
    return '';
  }
}

function saveKeyToStorage(key) {
  try {
    localStorage.setItem('nexusai_api_key', key);
  } catch (e) {
    // ignore
  }
}

function removeKeyFromStorage() {
  try {
    localStorage.removeItem('nexusai_api_key');
  } catch (e) {}
}

function updateMaskedKeyDisplay() {
  const apiKeyInput = document.getElementById('api-key');
  const maskedKeyDiv = document.getElementById('masked-key');
  const key = apiKeyInput.value.trim();
  const masked = maskKey(key);
  maskedKeyDiv.textContent = key ? `Key: ${masked}` : '';
}

function updateStatus(text) {
  document.getElementById('status').textContent = text;
}

function startTimer() {
  const timerEl = document.getElementById('timer');
  state.startTime = Date.now();
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    timerEl.textContent = `(${elapsed}s)`;
  }, 500);
}

function stopTimer() {
  clearInterval(state.timerId);
  document.getElementById('timer').textContent = '';
  state.timerId = null;
}

function clearError() {
  const errorDetails = document.getElementById('error-details');
  errorDetails.style.display = 'none';
  document.getElementById('error-text').textContent = '';
}

function showError(message, details) {
  const errorDetails = document.getElementById('error-details');
  const errorText = document.getElementById('error-text');
  errorText.textContent = `${message}${details ? '\n' + details : ''}`;
  errorDetails.open = true;
  errorDetails.style.display = 'block';
}

function buildImageRequest(promptText, width, height, candidateCount, seed, safetyLevel) {
  const body = {
    prompt: { text: promptText },
    imageSize: { width: parseInt(width, 10), height: parseInt(height, 10) },
    candidateCount: parseInt(candidateCount, 10) || 1,
    safetyFilterLevel: safetyLevel || NxConstants.defaultSafetyFilterLevel
  };
  if (seed) {
    const parsed = parseInt(seed, 10);
    if (!isNaN(parsed)) body.seed = parsed;
  }
  return body;
}

function buildTextRequest(promptText) {
  return {
    contents: [ { parts: [ { text: promptText } ] } ]
  };
}

async function callApiWithRetries(url, options) {
  let attempt = 0;
  let lastError;
  while (attempt < NxConstants.maxRetries) {
    updateStatus(attempt === 0 ? NxConstants.strings.generating : NxConstants.strings.retrying);
    const controller = new AbortController();
    state.abortController = controller;
    const timeoutId = setTimeout(() => controller.abort(), NxConstants.defaultTimeout);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      // successful response
      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        let details = '';
        try {
          const text = await response.text();
          details = text.slice(0, 2000);
        } catch (e) {}
        const error = new Error(errorMsg);
        error.details = details;
        lastError = error;
      } else {
        return await response.json();
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // fetch aborted or network error
      if (err.name === 'AbortError') {
        const abortErr = new Error('aborted');
        abortErr.details = '';
        throw abortErr;
      }
      lastError = err;
    }
    attempt++;
    if (attempt >= NxConstants.maxRetries) break;
    const delayIndex = Math.min(attempt - 1, NxConstants.retryDelays.length - 1);
    const baseDelay = NxConstants.retryDelays[delayIndex];
    const jitter = Math.floor(Math.random() * (NxConstants.jitterMax - NxConstants.jitterMin + 1)) + NxConstants.jitterMin;
    await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
  }
  throw lastError || new Error('Unknown error');
}

function parseResponse(response) {
  const results = [];
  if (!response) return results;
  if (response.images && Array.isArray(response.images)) {
    for (const img of response.images) {
      if (img && img.mimeType && img.data) {
        results.push({ type: 'image', mimeType: img.mimeType, data: img.data });
      }
    }
  }
  if (response.candidates && Array.isArray(response.candidates)) {
    for (const cand of response.candidates) {
      const content = cand.content;
      if (content && Array.isArray(content.parts)) {
        for (const part of content.parts) {
          if (part.text !== undefined && part.text !== null) {
            results.push({ type: 'text', text: part.text });
          } else {
            const inline = part.inlineData || part.inline_data;
            if (inline && inline.data) {
              const mime = inline.mimeType || inline.mime_type || 'image/png';
              results.push({ type: 'image', mimeType: mime, data: inline.data });
            }
          }
        }
      }
    }
  }
  // fallback regex search for mimeType & data pairs
  if (!results.some(r => r.type === 'image')) {
    try {
      const jsonStr = JSON.stringify(response);
      let match;
      while ((match = NxConstants.mimeDataRegex.exec(jsonStr)) !== null) {
        const mimeType = match[1];
        const data = match[2];
        results.push({ type: 'image', mimeType, data });
      }
    } catch (e) {
      // ignore
    }
  }
  return results;
}

async function createThumbnail(candidate) {
  const blob = base64ToBlob(candidate.data, candidate.mimeType);
  const url = URL.createObjectURL(blob);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      resolve({ previewUrl: url, width: w, height: h, blob: blob });
    };
    img.onerror = () => {
      resolve({ previewUrl: url, width: 0, height: 0, blob: blob });
    };
    img.src = url;
  });
}

function addResultToUI(candidate) {
  const resultsDiv = document.getElementById('results');
  const item = document.createElement('div');
  item.className = 'result-item';
  // checkbox for selection
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.dataset.index = candidate.index;
  item.appendChild(checkbox);
  if (candidate.type === 'image') {
    const thumbDiv = document.createElement('div');
    thumbDiv.className = 'thumb';
    const img = document.createElement('img');
    img.src = candidate.previewUrl;
    img.alt = 'Generated image';
    thumbDiv.appendChild(img);
    item.appendChild(thumbDiv);
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${candidate.mimeType} • ${candidate.width}×${candidate.height}`;
    item.appendChild(meta);
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveSingle(candidate));
    item.appendChild(saveBtn);
  } else if (candidate.type === 'text') {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const snippet = candidate.text.trim().slice(0, 60);
    summary.textContent = snippet + (candidate.text.length > 60 ? '…' : '');
    details.appendChild(summary);
    const pre = document.createElement('pre');
    pre.textContent = candidate.text;
    details.appendChild(pre);
    item.appendChild(details);
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveSingle(candidate));
    item.appendChild(saveBtn);
  }
  resultsDiv.appendChild(item);
}

function buildFilename(candidate, ext) {
  const mode = candidate.type === 'image' ? 'image' : 'text';
  const prefixInput = document.getElementById('prefix');
  const prefixTextInput = document.getElementById('prefix-text');
  const prefix = mode === 'image' ? prefixInput.value : prefixTextInput.value;
  const sanitized = sanitizeFilename(prefix);
  const timestamp = new Date().toISOString().replace(/[:\.]/g, '');
  const indexOrSeed = typeof candidate.seed !== 'undefined' ? candidate.seed : candidate.index;
  const parts = [];
  if (sanitized) parts.push(sanitized);
  parts.push(timestamp);
  parts.push(indexOrSeed);
  return parts.join('_') + '.' + ext;
}

function saveSingle(candidate) {
  if (candidate.type === 'image') {
    const blob = base64ToBlob(candidate.data, candidate.mimeType);
    const ext = (candidate.mimeType.split('/') || ['','png'])[1] || 'png';
    const filename = buildFilename(candidate, ext);
    downloadBlob(blob, filename);
  } else if (candidate.type === 'text') {
    const blob = new Blob([candidate.text], { type: 'text/plain' });
    const filename = buildFilename(candidate, 'txt');
    downloadBlob(blob, filename);
  }
}

async function saveAllOrSelected(selectedOnly) {
  const zip = new JSZip();
  const resultsDiv = document.getElementById('results');
  const checkboxes = resultsDiv.querySelectorAll('input[type="checkbox"]');
  const items = [];
  for (const cb of checkboxes) {
    const idx = parseInt(cb.dataset.index, 10);
    const candidate = state.results[idx];
    if (!candidate) continue;
    if (selectedOnly && !cb.checked) continue;
    items.push(candidate);
  }
  if (selectedOnly && items.length === 0) {
    showError('No items selected.', '');
    return;
  }
  for (const candidate of items) {
    if (candidate.type === 'image') {
      const fixed = fixBase64(candidate.data);
      const ext = (candidate.mimeType.split('/') || ['','png'])[1] || 'png';
      zip.file(buildFilename(candidate, ext), fixed, { base64: true });
    } else {
      zip.file(buildFilename(candidate, 'txt'), candidate.text);
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const zipName = `nexusai_results_${new Date().toISOString().replace(/[:\.]/g, '')}.zip`;
  downloadBlob(blob, zipName);
}

function clearPreviews() {
  state.results = [];
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
}

async function generateHandler() {
  if (state.generating) return;
  const modeSelect = document.getElementById('mode');
  const modelInput = document.getElementById('model');
  const apiKeyInput = document.getElementById('api-key');
  const transportSelect = document.getElementById('transport');
  const promptInput = document.getElementById('prompt');
  const candidateCountInput = document.getElementById('candidate-count');
  const sizeSelect = document.getElementById('size-preset');
  const customWidth = document.getElementById('custom-width');
  const customHeight = document.getElementById('custom-height');
  const seedInput = document.getElementById('seed');
  const persistKeyCheckbox = document.getElementById('persist-key');
  const generateBtn = document.getElementById('generate');
  const cancelBtn = document.getElementById('cancel');

  clearError();
  const mode = modeSelect.value;
  const model = modelInput.value.trim();
  const prompt = promptInput.value.trim();
  const key = apiKeyInput.value.trim();
  if (!key) {
    showError('API key required', '');
    return;
  }
  if (!prompt) {
    showError('Prompt is required', '');
    return;
  }
  if (!model) {
    showError('Model ID is required', '');
    return;
  }
  // persist key if requested
  if (persistKeyCheckbox.checked) {
    saveKeyToStorage(key);
  } else {
    removeKeyFromStorage();
  }
  state.generating = true;
  generateBtn.disabled = true;
  cancelBtn.disabled = false;
  updateStatus(NxConstants.strings.generating);
  startTimer();
  state.results = [];
  document.getElementById('results').innerHTML = '';
  // Build URL and body
  let url = NxConstants.baseUrl + NxConstants.routeTemplate.replace('{model}', encodeURIComponent(model));
  const headers = { 'Content-Type': 'application/json' };
  if (transportSelect.value === 'header') {
    headers[NxConstants.headerKeyName] = key;
  } else {
    const delim = url.includes('?') ? '&' : '?';
    url += delim + NxConstants.queryKeyName + '=' + encodeURIComponent(key);
  }
  let body;
  if (mode === 'image') {
    let width, height;
    if (sizeSelect.value === 'custom') {
      width = customWidth.value || 512;
      height = customHeight.value || 512;
    } else {
      const parts = sizeSelect.value.split('x');
      width = parts[0];
      height = parts[1];
    }
    const candidateCount = candidateCountInput.value || '1';
    const seed = seedInput.value;
    body = buildImageRequest(prompt, width, height, candidateCount, seed, NxConstants.defaultSafetyFilterLevel);
  } else {
    body = buildTextRequest(prompt);
  }
  try {
    const response = await callApiWithRetries(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    stopTimer();
    updateStatus(NxConstants.strings.idle);
    state.abortController = null;
    const candidates = parseResponse(response);
    if (candidates.length === 0) {
      showError('No results returned', '');
    }
    // process results sequentially to preserve index
    for (let i = 0; i < candidates.length; i++) {
      const cand = candidates[i];
      cand.index = state.results.length;
      if (cand.type === 'image') {
        const info = await createThumbnail(cand);
        cand.previewUrl = info.previewUrl;
        cand.width = info.width;
        cand.height = info.height;
        // keep blob only if needed for preview; zipped will use base64
      }
      state.results.push(cand);
      addResultToUI(cand);
    }
  } catch (err) {
    stopTimer();
    if (err.message === 'aborted') {
      updateStatus(NxConstants.strings.cancelled);
    } else {
      updateStatus(NxConstants.strings.idle);
    }
    const msg = err.message || 'Error';
    const details = err.details || '';
    showError(msg, details);
  } finally {
    state.generating = false;
    generateBtn.disabled = false;
    cancelBtn.disabled = true;
  }
}

function cancelHandler() {
  if (state.abortController) {
    try {
      state.abortController.abort();
    } catch (e) {}
  }
  state.generating = false;
  updateStatus(NxConstants.strings.cancelled);
  stopTimer();
  document.getElementById('generate').disabled = false;
  document.getElementById('cancel').disabled = true;
}

function setDefaultModel() {
  const mode = document.getElementById('mode').value;
  const modelInput = document.getElementById('model');
  modelInput.value = NxConstants.models[mode];
}

function toggleModeOptions() {
  const mode = document.getElementById('mode').value;
  const imageOpts = document.getElementById('image-options');
  const textOpts = document.getElementById('text-options');
  if (mode === 'image') {
    imageOpts.style.display = '';
    textOpts.style.display = 'none';
  } else {
    imageOpts.style.display = 'none';
    textOpts.style.display = '';
  }
}

function toggleCustomSize() {
  const preset = document.getElementById('size-preset').value;
  const customFields = document.getElementById('custom-size-fields');
  if (preset === 'custom') {
    customFields.style.display = 'inline-flex';
  } else {
    customFields.style.display = 'none';
  }
}

function init() {
  // DOM element references
  const apiKeyInput = document.getElementById('api-key');
  const persistCheckbox = document.getElementById('persist-key');
  // Load key from storage if exists
  const storedKey = loadKeyFromStorage();
  if (storedKey) {
    apiKeyInput.value = storedKey;
    persistCheckbox.checked = true;
  }
  updateMaskedKeyDisplay();
  // Set default model for initial mode
  setDefaultModel();
  toggleModeOptions();
  toggleCustomSize();
  // Event listeners
  apiKeyInput.addEventListener('input', () => {
    updateMaskedKeyDisplay();
  });
  document.getElementById('persist-key').addEventListener('change', (e) => {
    if (e.target.checked) {
      saveKeyToStorage(apiKeyInput.value.trim());
    } else {
      removeKeyFromStorage();
    }
  });
  document.getElementById('set-default-model').addEventListener('click', setDefaultModel);
  document.getElementById('mode').addEventListener('change', () => {
    toggleModeOptions();
    setDefaultModel();
  });
  document.getElementById('size-preset').addEventListener('change', toggleCustomSize);
  document.getElementById('generate').addEventListener('click', generateHandler);
  document.getElementById('cancel').addEventListener('click', cancelHandler);
  document.getElementById('save-selected').addEventListener('click', () => saveAllOrSelected(true));
  document.getElementById('save-all').addEventListener('click', () => saveAllOrSelected(false));
  document.getElementById('clear-previews').addEventListener('click', clearPreviews);
}

document.addEventListener('DOMContentLoaded', init);
