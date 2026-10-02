# Scraper Branch

## Separate experiment

`Started-building-scraper-app` at `0c598a5d7a559fdf4b23e3becaabd66e4bda81fc` contains `AnalyticsScraper/social_analytics_tool/backend/` and frontend code, plus large tracked environment/profile material.

Backend `app.py` defines Flask Google/YouTube authorization, callback, and analytics routes on localhost:5000 with development/debug assumptions and fixed January 2023 dates. `scraper.py` uses Playwright, cookie JSON, and page-specific selectors; `youtube_analytics_api.py` is another OAuth helper. Do not contact services or reuse stored cookies without a separately approved runtime scope.

The frontend declares React 19, react-scripts 5.0.1, and Axios. App.js remains a starter screen. Analytics/Comments components expect `/api/analytics`, `/api/comments`, and `/api/reply`, which differ from the inspected Flask route surface. No connected scraping/reply workflow is established. Default-branch setup requires none of these Python/npm dependencies.

## Source evidence

- [app.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/app.js)
- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
- [AnalyticsScraper/social_analytics_tool/backend/app.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/app.py)
- [AnalyticsScraper/social_analytics_tool/backend/scraper.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/scraper.py)
- [AnalyticsScraper/social_analytics_tool/frontend/package.json](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/package.json)
- [AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js)
