# Integration Test Audit

Tests should be black-box integration tests using only `t.fixture()`, `t.setBoard()`, `t.choose()`, `t.action()`, `t.testBoard()`, `t.currentChoices()`, and `game.state.*` reads for assertions.

## Critical: Direct state mutations via private methods

These bypass the game flow entirely (hooks, faction abilities, etc).

### `exploration.test.js` — 18x `game._explorePlanet()`
- Lines: 177, 181, 199, 217, 308, 311, 316, 351, 537, 767, 770, 831, 881, 888, 1591, 1620, 1646, 1673
- Also: `game._getPlanetAttachmentBonuses()` at line 1676
- Also: `game._getAdjacentSystems()` at lines 108, 281, 321, 331

### `actionCards.test.js`
- Line 85: `game._drawActionCards(dennis, 1)`
- Line 118: `game._drawSecretObjective(dennis)`

### `naaz-rokha-alliance.test.js`
- Line ~1103: `game._exhaustTech(dennis, 'supercharge')` after `game.run()`

### `galaxy.test.js`
- Line 307: `game._addUnit(sysId, 'space', 'cruiser', 'micah')`

## Medium: Private method calls for read-only assertions

Not black-box, but at least not mutating state through bypassed flows.

### `unitUpgrades.test.js` — 22x `game._getUnitStats()`
- Entire file tests unit stats by calling the private method directly

### Faction tests with `_getUnitStats()`
- `naalu-collective.test.js`: lines 630, 641
- `mahact-gene-sorcerers.test.js`: line 708
- `clan-of-saar.test.js`: lines 985, 1001
- `titans-of-ul.test.js`: lines 714, 726, 743, 754
- `sardakk-norr.test.js`: line 578
- `embers-of-muaat.test.js`: lines 511, 528
- `l1z1x-mindnet.test.js`: line 671
- `federation-of-sol.test.js`: lines 454, 489
- `argent-flight.test.js`: lines 596, 650, 676

### `galaxy.test.js` — 15x `game._getAdjacentSystems()`
- Lines: 117, 130, 143, 156, 170, 196, 215, 542, 546, 569, 572, 586, 624, 627, 645

### Other read-only private method calls
- `game._isLawActive()`: `factionAbilities.test.js` (140, 148, 149), `council-keleres.test.js` (69, 93)
- `game._isTechReady()`: `emirates-of-hacan.test.js` (509), `l1z1x-mindnet.test.js` (629)
- `game._controlsHomeSystemPlanets()`: `clan-of-saar.test.js` (113)
- `game._getPlanetAttachmentBonuses()`: `relicAbilities.test.js` (376)
- `game._countCombatAbilityUnits()`: `argent-flight.test.js` (330)
- `game._getRetreatTargets()`: `spaceCombat.test.js` (295, 298)
- `game._getAdjacentSystems()`: `spaceCombat.test.js` (318, 343), `strategicAction.test.js` (325)

## Low: Faction ability method calls for assertions

- `game.factionAbilities.getExplorationBonus()`: `naaz-rokha-alliance.test.js` (70)
- `game.factionAbilities.getCombatModifier()`: `winnu.test.js` (204, 218, 234)
- `game.factionAbilities.getStatusPhaseTokenBonus()`: `winnu.test.js` (250, 263)
- `game.factionAbilities.canMoveThroughNebulae()`: `empyrean.test.js` (55, 56)
- `game.factionAbilities._hasAbility()`: `empyrean.test.js` (190)
- `game.factionAbilities.getAvailableComponentActions()`: `vuil-raith-cabal.test.js` (616)

## Resolution Status

### Critical (all resolved)
- [x] `naaz-rokha-alliance.test.js` — 4x `game._explorePlanet()` converted to Agent flow
- [x] `exploration.test.js` — all `_explorePlanet()`, `_initExplorationDecks()`, `_getAdjacentSystems()`, `_getPlanetAttachmentBonuses()` converted to invasion/movement flow
- [x] `actionCards.test.js` — `_drawActionCards` → status phase flow, `_drawSecretObjective` → imperial secondary flow
- [x] `naaz-rokha-alliance.test.js` — `_exhaustTech` → `setBoard` with `exhaustedTechs`; `getCombatModifier` unit test removed (covered by integration tests); `getExplorationBonus` unit tests removed (covered by integration tests)
- [x] `galaxy.test.js` — `_addUnit` → `setBoard` with pre-placed units

### Medium (read-only, not yet resolved)
- [ ] `unitUpgrades.test.js` — 22x `_getUnitStats`
- [ ] `galaxy.test.js` — 15x `_getAdjacentSystems` (read-only model queries)
- [ ] Faction tests — various `_getUnitStats` calls
- [ ] Other read-only private method calls (`_isLawActive`, `_isTechReady`, etc.)

### Low (not yet resolved)
- [ ] Faction ability method calls for assertions
