# Architecture

`index.html` provides API/model/input controls and loads JSZip 3.10.1 from a CDN. `app.js` constructs generateContent requests to the Google generative-language v1beta endpoint, retries requests, supports AbortController cancellation, parses text and inline image data, builds previews, and exports selected/all images as ZIP.

An API key can optionally persist under localStorage key `nexusai_api_key`. The code includes configured Gemini model strings; their current service availability is not established. Width/height controls are read by UI code but not applied by the image request builder.

The scraper branch contains Flask Google/YouTube OAuth/analytics routes, Playwright cookie-based scraping, and a React frontend. App.js remains a starter screen, and Analytics/Comments components reference routes not implemented by the inspected Flask app.

## Preservation and reuse

A compact request/retry/response/export example plus historical analytics/scraper experiments with clear integration gaps.

## Source evidence

- [app.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/app.js)
- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
- [AnalyticsScraper/social_analytics_tool/backend/app.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/app.py)
- [AnalyticsScraper/social_analytics_tool/backend/scraper.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/scraper.py)
- [AnalyticsScraper/social_analytics_tool/frontend/package.json](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/package.json)
- [AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js)
