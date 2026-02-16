# Demonweb Expansion — Remaining Issues

## Testing
- [ ] No dedicated demonweb unit tests (map assembly, rotation, neighbor computation)
- [ ] No tests for gemstone rules (acquire, spend, turn restrictions)
- [ ] No tests for A2 triad bonus logic
- [ ] No tests for dark banner start site selection
- [ ] X hexes (experimental tiles) untested

## UI Polish
- [ ] No zoom/pan controls for hex map
- [ ] No hex info tooltips (site names, VP values on hover)
- [x] No A2 triad status indicator (show current tier per player)
- [ ] No visual feedback for gem acquisition/spending
- [ ] No special styling for gem spending prompts (power vs influence choice)
- [ ] No animations for troop placement or gem collection

## UX / Interaction
- [ ] No rotation conflict UI (spec: "game owner decides first hex, then clockwise")
- [ ] No mobile-friendly touch interactions for hex map
- [ ] No "simplified view" option mentioned in proposal

## Edge Cases
- [ ] Verify dead-end edge tunnel behavior in practice
- [ ] Verify cross-hex movement works correctly across all tile combinations
- [ ] Confirm dark banner site mechanic matches designer intent
