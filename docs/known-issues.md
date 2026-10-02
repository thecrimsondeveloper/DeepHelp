# Known issues and unknowns

### MNT-104-F01

Confirmed UI limitation: dimension controls do not govern image request dimensions.

Action: Recommended later: verify the affected configuration/behavior before rehabilitation or claims of support.

### MNT-104-F02

Confirmed security boundary: optional API-key localStorage persistence; tracked credential/profile/environment material exists on scraper branch.

Action: Required before credential/service use; remediation is outside this documentation pass.

### MNT-104-F03

Confirmed integration gap: scraper frontend route expectations differ from backend routes; starter App does not establish integration.

Action: Recommended later: verify the affected configuration/behavior before rehabilitation or claims of support.

### MNT-104-F04

Unverified: live API models, retry/cancellation edge cases, exports, OAuth, selectors, and analytics results.

Action: Recommended later: verify the affected configuration/behavior before rehabilitation or claims of support.

## Ownership and continuation

Repository maintenance is authorized for this documentation pass. Original product/client ownership, complete asset rights, and any canonical successor remain unverified unless specifically evidenced in [provenance](provenance.md) or [history](project-history.md). These unknowns do not grant permission for publication or reconstruction.

Next bounded action: Validate the local UI without live keys; separately authorize credential handling and a live API or scraper integration pass.

## Source evidence

- [app.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/app.js)
- [index.html](https://github.com/thecrimsondeveloper/DeepHelp/blob/eb87b94fd3c9b8ea3241e4a64215d1352d529781/index.html)
- [AnalyticsScraper/social_analytics_tool/backend/app.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/app.py)
- [AnalyticsScraper/social_analytics_tool/backend/scraper.py](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/backend/scraper.py)
- [AnalyticsScraper/social_analytics_tool/frontend/package.json](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/package.json)
- [AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js](https://github.com/thecrimsondeveloper/DeepHelp/blob/0c598a5d7a559fdf4b23e3becaabd66e4bda81fc/AnalyticsScraper/social_analytics_tool/frontend/src/Analytics.js)
