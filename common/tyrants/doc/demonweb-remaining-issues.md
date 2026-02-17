# Demonweb Expansion — Remaining Issues

## Testing
- [x] Dedicated demonweb unit tests (map assembly, rotation, neighbor computation) — `demonweb.test.js`, 27 tests
- [ ] No tests for gemstone rules (acquire, spend, turn restrictions)
- [ ] No tests for A2 triad bonus logic
- [ ] No tests for dark banner start site selection
- [ ] X hexes (experimental tiles) untested

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
- [ ] Confirm dark banner site mechanic matches designer intent
