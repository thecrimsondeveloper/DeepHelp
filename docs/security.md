# Security

## Default branch

The API key is entered in the browser and can optionally persist in localStorage as `nexusai_api_key`. Browser storage is available to scripts on the same origin and to users with access to the browser profile. Prefer temporary entry for inspection; clear persisted keys after use. Inspect request transport and verbose logging before using real credentials. Masking a display value does not prove all request/error logs are safe.

## Scraper branch

The branch tracks credential-related filenames, a virtual environment, and browser-profile state. Do not read or reuse stored sessions for exploratory checks, publish their contents, or commit new cookies/keys. Flask source includes a non-production example secret and debug mode; OAuth uses local development routes and fixed analytics dates. A production security review and credential/profile cleanup require separate authorization. No credentials were used during documentation.

## Source evidence

- [app.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/app.js)
- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
- [AnalyticsScraper/social_analytics_tool/backend/app.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/app.py)
- [AnalyticsScraper/social_analytics_tool/backend/scraper.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/scraper.py)
- [AnalyticsScraper/social_analytics_tool/frontend/package.json](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/package.json)
- [AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js)
