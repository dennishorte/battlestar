# Demonweb Expansion — Remaining Issues

## Testing
- [x] Dedicated demonweb unit tests (map assembly, rotation, neighbor computation) — `demonweb.test.js`
- [x] Gemstone rules tested (acquire, spend, turn restrictions) — 12 tests in `demonweb.test.js`
- [x] A2 triad bonus tests (presence, control, total control, accumulation, tier priority) — 10 tests using mapLayout
- [x] Map layout codec tests (encode/decode round-trip, validation errors) — 11 tests
- [x] mapLayout setting tests (exact tiles, rotations, partial layouts, backward compat) — 6 tests
- [x] Starting location tests (choices from start:true sites, per-tile contributions, exclusion, deploy) — 11 tests
- [ ] X hexes (experimental tiles) untested

## Map Layout Export/Import
- [x] Codec: encode/decode/validate in `mapLayoutCodec.js`
- [x] Engine: `mapLayout` setting overrides random tile selection with specific tiles+rotations
- [x] Game UI: "export map layout" button in GameMenu copies layout string to clipboard
- [x] Lobby UI: import text input in SettingsTyrants with decode/validate/auto-switch-map

## Triad Bonus Timing
- [x] Triad bonus fires at start of turn (preActions) — influence/power available for spending
- [x] Triad bonus re-checks after aDeploy for mid-turn completion
- [x] Per-turn tier tracking prevents double-counting

## UI Polish
- [ ] No zoom/pan controls for hex map
- [ ] No hex info tooltips (site names, VP values on hover)
- [x] A2 triad status indicator (show current tier per player)
- [ ] No visual feedback for gem acquisition/spending
- [ ] No special styling for gem spending prompts (power vs influence choice)
- [ ] No animations for troop placement or gem collection

## UX / Interaction
- [x] Manual hex rotation setup — random player rotates tiles before game, next player goes first
- [ ] No mobile-friendly touch interactions for hex map
- [ ] No "simplified view" option mentioned in proposal

## Edge Cases
- [x] Neighbor relationships verified bidirectional in tests
- [x] Cross-hex connections verified to exist between adjacent tiles in tests
- [ ] Verify dead-end edge tunnel behavior in practice
- [x] Confirm dark banner site mechanic matches designer intent — just starting locations, no special mechanic
