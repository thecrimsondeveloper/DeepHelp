# Dependencies

## Default branch

Browser DOM/FileReader/fetch/AbortController/Blob facilities are used by app.js. index.html loads JSZip 3.10.1 from a CDN, so ZIP export depends on that script loading. The Gemini generative-language API is an external service; configured model names and API availability are unverified. No npm installation is required by the default two-file application.

## Separate scraper branch

Flask, Google OAuth/YouTube API helpers, Playwright, React 19, react-scripts 5.0.1, and Axios belong to Started-building-scraper-app. Its tracked virtual environment is not a portable or trustworthy installation recipe. Review dependency manifests and credential boundaries before a separately authorized reconstruction; do not reuse its browser profile.

## Source evidence
