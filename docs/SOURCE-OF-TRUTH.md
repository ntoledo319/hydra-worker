# HYDRA source-of-truth boundary

Effective 2026-07-25:

- `active/hydra-worker` owns the Worker code, OpenAPI description, operator
  documentation, and editable `docs/index.html` surface.
- `archive/duplicates/hydra-site` preserves the former standalone static-site
  checkout at commit `e961c9d60348d3f767ea782ee595b781977458ab`.
- The two HTML files were exactly byte-identical at enactment:
  SHA-256 `dfbcface41ac83c2ecb6643df1874c46550e87153cf3459df46cc3f19ed26678`.
- Git histories were not spliced and the archived remote was not deleted.

The archived file is a historical baseline, not a mirror that must follow
future edits. New HYDRA surface work belongs here and requires the normal
Worker tests and an explicit deployment decision.
