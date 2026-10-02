# Api Contract

## Request and response surface

The validator calls `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`. Read `app.js` request builders for the current authentication transport, contents/parts, optional image MIME/data, and model-specific request body. Do not copy keys or authenticated request URLs into logs/docs.

Text and inline image responses are parsed, including inlineData/inline_data spellings. Images become browser previews/blobs and export entries. Configured model strings are source configuration, not proof that those endpoints remain available.

The retry helper uses maxRetries 3, a 30-second timeout, and increasing delays based on 1/2/4 seconds with jitter. Confirm exact attempt semantics and cancellation across retries in a browser before promising a maximum overall duration. Width/height UI values are not applied by the image request builder, so output dimensions are not guaranteed by those controls.

## Source evidence

- [app.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/app.js)
- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
- [AnalyticsScraper/social_analytics_tool/backend/app.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/app.py)
- [AnalyticsScraper/social_analytics_tool/backend/scraper.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/scraper.py)
- [AnalyticsScraper/social_analytics_tool/frontend/package.json](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/package.json)
- [AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js)
