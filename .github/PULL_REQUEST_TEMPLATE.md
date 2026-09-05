## Summary

<!-- What changed and why. Remember: merging never deploys; `wrangler deploy` is a separate, explicit decision. -->

## History-impact declaration (required — exactly one)

Run `node scripts/project_history.mjs assess` and pick one:

- [ ] `history:recorded <event-id>` — event capsule added/amended under `.project-history/events/`, doctrine and `docs/history/` updated, `render` run, `validate` passes
- [ ] `history:none — <specific reason>` — immaterial change (say why; a bare skip is rejected by CI)
- [ ] `history:defer — <tracking item, owner, deadline YYYY-MM-DD>` — emergency/security work; deferral registered in `.project-history/policy.yml`

Declaration line (CI parses this):

```
history:
```

## Checks

- [ ] `node scripts/project_history.mjs validate`
- [ ] `node scripts/project_history.mjs render --check`
- [ ] `node --test test/project_history_tests.mjs`
- [ ] Endpoint count and the `/` banner's `docs` link still agree with `src/index.js` if either was touched
- [ ] No secrets, tokens, env values or personal data in any changed file
