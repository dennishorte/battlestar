# Blocked Minor Improvements

100 of 124 minor improvement cards (+ related occupations) are complete with passing tests.
21 cards remain blocked on engine infrastructure, grouped by what they need.

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

## Group 2: Custom Action Spaces (2 cards)

Cards that create new action spaces any player can use.

| Card | Deck | What it does |
|------|------|-------------|
| AlchemistsLab (e081) | E | Owner gets 1 of each building resource they have; others pay 1 food |
| Archway (d051) | D | All players get 1 food, then use an unoccupied space before returning home |

**Infrastructure needed:**
- Card-based action space registration (card becomes a usable space)
- Owner vs. non-owner logic (different effects per player)
- Extra-action-before-return-home phase (Archway)

**Key files:** `agricola.js` (action space setup, workPhase), `AgricolaActionManager.js`
**Complexity:** Complex — new action space type + end-of-round phase

---

## Group 3: Action Space Combination/Override (4 cards)

Cards that modify how existing action spaces work.

| Card | Deck | What it does |
|------|------|-------------|
| JobContract (c023) | C | Use Day Laborer + Lessons with single person, both marked occupied |
| Recruitment (d021) | D | On Minor Improvement action, can take Family Growth instead (if room) |
| WoodSaw (e014) | E | When all others have more workers, take Build Rooms without placing person |
| CarpentersYard (d026) | D | Build Joinery+Well on Minor action, or both on single Major action |

**Infrastructure needed:**
- Combined action space pairing (one person → two spaces occupied)
- Action substitution hooks (minor improvement → family growth)
- Conditional free-action-space usage (no person needed under conditions)

**Key files:** `agricola.js` (executeAction, playerTurn), `AgricolaActionManager.js`
**Complexity:** Moderate-Complex — each card is a different kind of override

---

## Group 4: Field/Plow Mechanics (5 cards)

Cards needing `plowField` options or card-based field tiles.

| Card | Deck | What it does |
|------|------|-------------|
| NewlyPlowedField (c017) | C | On play, plow 1 field (non-adjacent allowed) |
| ZigzagHarrow (d001) | D | On play, plow 1 field completing a zigzag pattern |
| SwingPlow (c019) | C | Place 4 field tiles on card; each Farmland action, plow up to 2 from card |
| TurnwrestPlow (d020) | D | Place 2 field tiles on card; each Farmland/Cultivation, plow up to 2 from card |
| WoodField (d075) | D | Card-based "wood field" — sow wood like grain, harvest wood |

**Infrastructure needed:**
- `plowField()` options: `allowNonAdjacent`, `zigzagPattern` validation
- Card-based field tile charges (store N tiles on card, spend on plow actions)
- Wood-as-crop sowing/harvesting (new crop type in field system)

**Key files:** `AgricolaActionManager.js` (plowField), `AgricolaPlayer.js` (sowField, fields)
**Complexity:** Moderate — plowField options are straightforward; wood-as-crop is novel

---

## Group 5: Cost/Resource Hooks (2 cards)

Cards needing hooks wired into build/redevelopment cost calculations.

| Card | Deck | What it does |
|------|------|-------------|
| RoyalWood (d074) | D | Get 1 wood back per 2 wood paid for Farm Expansion or improvement |
| HuntingTrophy (d082) | D | House Redevelopment costs -1 resource; Farm Redevelopment fences -3 wood |

**Infrastructure needed:**
- `onBuildImprovement` / `onFarmExpansion` hooks with wood-paid param
- `modifyHouseRedevelopmentCost` / `modifyFarmRedevelopmentFenceCost` hooks

**Key files:** `agricola.js` (redevelopment actions), `AgricolaActionManager.js`
**Complexity:** Moderate — hook wiring pattern is well-established

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

## Group 7: Turn Flow / Deferred (2 cards)

| Card | Deck | What it does |
|------|------|-------------|
| SourDough (e062) | E | Once/round, if all players have ≥1 person left, skip placement for Bake Bread |
| Sower (c115, occ) | C | Place reed on card per major built; exchange reed for Sow action anytime |

**Infrastructure needed:**
- Placement-skip conditionals (skip worker placement under game-state conditions)
- Per-card resource tracking on major improvements (reed accumulates on card)

**Key files:** `agricola.js` (playerTurn, workPhase)
**Complexity:** Moderate — SourDough needs placement-skip; Sower needs card-resource tracking
