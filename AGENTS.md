# Working in DeepHelp

## Reading order

Read [README.md](README.md), [.agent/repository-profile.md](.agent/repository-profile.md), [.agent/start-here.md](.agent/start-here.md), and [known issues](docs/known-issues.md). Read the subsystem guide before changing its source.

## Repository boundaries

This is browser gemini api validator and separate scraper experiment. Validate the local UI without live keys; separately authorize credential handling and a live API or scraper integration pass.

Keep source claims branch-specific and supported by exact paths/symbols. Do not infer functionality from names, package declarations, disabled code, or design documentation. Do not upgrade editors/packages, enable commented implementation, merge prototype branches, modify assets/settings/workflows, or repair product behavior as part of a documentation pass. Never expose or use embedded credentials, license contents, cookies, or stored browser profiles.

## Validation and stop conditions

Follow [validation.md](docs/validation.md). Check Markdown links, exact casing, and the documentation-only diff. Preserve source and asset blob identities outside the approved documentation allowlist. Stop if branch/head or checkout ownership changes, required source is inaccessible, or a claim contradicts source. Runtime, service, headset, deployment, licensing, and credential-remediation work requires its own authorized scope.

Update memory only for durable facts; append the agent log only for material maintenance events. Keep the human changelog separate from the agent event log.
