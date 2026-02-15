# Blocked Minor Improvements

112 of 124 minor improvement cards (+ related occupations) are complete with passing tests.
9 cards remain blocked on engine infrastructure, grouped by what they need.

---

## Group 1: Worker Placement Modifications (5 cards)

Core turn loop changes in `agricola.js` — how/when workers get placed.

| Card | Deck | What it does |
|------|------|-------------|
| BasketChair (c022) | C | Move first-placed worker to card, immediately place another |
| BrotherlyLove (d024) | D | With 4 people, place 3rd+4th back-to-back, same space allowed |
| TeaHouse (d053) | D | Once/round skip placing 2nd person (get food), place later |
| GuestRoom (e022) | E | Store food on card; spend 1 to place person from general supply |
| WorkPermit (d022) | D | Schedule a person placement to a future round |

**Infrastructure needed:**
- Worker placement flow in `playerTurn()` / `workPhase()` — skip, reorder, defer
- Guest worker concept (place from general supply, not player's pool)
- Scheduled future workers (place in a later round)

**Key files:** `agricola.js` (playerTurn, workPhase), `AgricolaPlayer.js`
**Complexity:** Complex — touches the core game loop

---

## ~~Group 2: Custom Action Spaces (2 cards)~~ — DONE

All cards completed: AlchemistsLab, Archway

---

## ~~Group 3: Action Space Combination/Override (2 cards)~~ — DONE

All cards completed: JobContract, WoodSaw

---

## ~~Group 4: Field/Plow Mechanics (1 card)~~ — DONE

All cards completed: WoodField

---

## ~~Group 5: Cost/Resource Hooks (2 cards)~~ — DONE

All cards completed: RoyalWood, HuntingTrophy

---

## Group 6: Fencing Alternatives (1 card)

| Card | Deck | What it does |
|------|------|-------------|
| WoodPalisades (b030) | B | Place 2 wood on edge fence spaces instead of real fences; 1 bonus point each |

**Infrastructure needed:**
- Wood-as-fence-material system (wood placed on edges, not real fences)
- Edge-only validation (palisades only on outer edges)
- Palisade bonus scoring

**Key files:** `AgricolaPlayer.js` (fence/pasture system), `AgricolaScoring.js`
**Complexity:** Moderate — parallel fence system with different material + scoring

---

## ~~Group 7: Turn Flow / Deferred (2 cards)~~ — DONE

All cards completed: SourDough, Sower

---

## Summary

| Group | Status | Cards |
|-------|--------|-------|
| 1. Worker Placement Mods | Blocked | 5 cards |
| 2. Custom Action Spaces | Done | AlchemistsLab, Archway |
| 3. Action Combination | Done | JobContract, WoodSaw |
| 4. Field/Plow Mechanics | Done | WoodField |
| 5. Cost/Resource Hooks | Done | RoyalWood, HuntingTrophy |
| 6. Fencing Alternatives | Blocked | 1 card (WoodPalisades) |
| 7. Turn Flow / Deferred | Done | SourDough, Sower |

**Remaining blocked:** 5 Group 1 + 1 Group 6 = **6 cards** (+ 3 related occupations from Group 1)

---

## Recently Completed

- **Batch (Groups 2+3+4+7):** AlchemistsLab, WoodField, Sower, Archway, SourDough, WoodSaw, JobContract
- **Batch (Groups 3+4):** ZigzagHarrow, SwingPlow, TurnwrestPlow, CarpentersYard, Recruitment
- **Batch (Groups 4+5):** NewlyPlowedField, RoyalWood, HuntingTrophy
