# Faction Status

25 factions. 349 tests passing across 23 test files.

## Fully Implemented (8)

All abilities coded in `systems/factionAbilities.js`, gameplay tests in `factionAbilities.test.js`, data tests in `factions.test.js`.

| Faction | Abilities | Tests |
|---------|-----------|-------|
| Federation of Sol | `orbital-drop` (component action), `versatile` (+1 token in status) | 3 |
| Sardakk N'orr | `unrelenting` (+1 combat) | 2 |
| Barony of Letnev | `armada` (fleet +2), `munitions-reserves` (2 TG reroll) | 4 |
| Emirates of Hacan | `guild-ships` (trade non-neighbors), `masters-of-trade` (free Trade secondary) | 4 |
| Naalu Collective | `telepathic` (initiative 0), `foresight` (retreat ship) | 3 |
| Mentak Coalition | `ambush` (pre-combat shots), `pillage` (steal from trades) | 2 |
| Yssaril Tribes | `stall-tactics` (discard card), `scheming` (draw+1, discard 1), `crafty` (no hand limit) | 4 |
| Universities of Jol-Nar | `fragile` (-1 combat), `analytical` (skip 1 prereq), `brilliant` (exhaust 2 techs, skip 1 prereq) | 6 |

## Partially Implemented (1)

| Faction | Done | Missing |
|---------|------|---------|
| Emirates of Hacan | `guild-ships`, `masters-of-trade` | `arbiters` (action cards in transactions) |

## Data Only (17)

Complete faction data files (starting techs, units, abilities, faction techs, flagship, mech, leaders) but no gameplay ability code.

| Faction | Abilities | Complexity |
|---------|-----------|------------|
| Arborec | `mitosis` | Simple |
| Clan of Saar | `scavenge`, `nomadic` | Simple |
| Embers of Muaat | `star-forge`, `gashlai-physiology` | Simple |
| Yin Brotherhood | `indoctrination`, `devotion` | Simple |
| L1Z1X Mindnet | `assimilate`, `harrow` | Simple |
| Winnu | `blood-ties`, `reclamation` | Simple |
| Xxcha Kingdom | `peace-accords`, `quash` | Simple |
| Ghosts of Creuss | `quantum-entanglement`, `slipstream`, `creuss-gate` | Complex |
| Nekro Virus | `galactic-threat`, `technological-singularity`, `propagation` | Complex |
| Argent Flight | `zeal`, `raid-formation` | Complex |
| Empyrean | `voidborn`, `aetherpassage`, `dark-whispers` | Complex |
| Mahact Gene-Sorcerers | `edict`, `imperia`, `hubris` | Complex |
| Naaz-Rokha Alliance | `distant-suns`, `fabrication` | Complex |
| Nomad | `the-company`, `future-sight` | Complex |
| Titans of Ul | `terragenesis`, `awaken`, `coalescence` | Complex |
| Vuil'raith Cabal | `devour`, `amalgamation`, `riftmeld` | Complex |
| Council Keleres | `the-tribunii`, `council-patronage`, `laws-order` | Complex |

---

## Remaining Plan

### Next: Finish Hacan

Add `arbiters` — allow action cards in transaction offers. Hooks into `_resolveTransaction`.

### Phase 2: Simple Factions (~15 abilities)

These use existing game hooks with straightforward logic.

| Faction | Abilities | Hooks Into |
|---------|-----------|------------|
| Arborec | `mitosis` — place 1 infantry in status phase | `onStatusPhase` (new) |
| Clan of Saar | `scavenge` — 1 TG on planet gain; `nomadic` — score without home | `onPlanetGained` (new) |
| Embers of Muaat | `star-forge` — component action; `gashlai-physiology` — move through supernovae | component action registry, movement |
| Yin Brotherhood | `devotion` — destroy ship for hit; `indoctrination` — replace infantry | combat triggers |
| L1Z1X Mindnet | `assimilate` — replace PDS/docks; `harrow` — ground forces produce hits | `onPlanetGained`, ground combat |
| Winnu | `blood-ties` — free custodians; `reclamation` — PDS+dock on Mecatol | `onPlanetGained` |
| Xxcha Kingdom | `peace-accords` — gain planet after diplomacy; `quash` — discard agenda | diplomacy hook, agenda hook |

### Phase 3: Complex Factions (~25 abilities)

These need new subsystems or deeply cross-cutting mechanics.

| Faction | Why Complex |
|---------|-------------|
| Ghosts of Creuss | Wormhole adjacency modifications, Creuss Gate placement |
| Nekro Virus | Unique tech acquisition replacing normal research |
| Argent Flight | Agenda voting modification, AFB interaction |
| Empyrean | Cross-player movement permissions |
| Nomad | 3 agents with unique economy |
| Titans of Ul | Sleeper token system |
| Vuil'raith Cabal | Captured unit economy |
| Mahact Gene-Sorcerers | Commander stealing, alliance restrictions |
| Naaz-Rokha Alliance | Exploration bonuses, fragment economy |
| Council Keleres | Sub-faction selection, variable setup |

---

## Hooks

### Existing

| Hook | Location | Used By |
|------|----------|---------|
| `onSpaceCombatStart(systemId, attacker, defender)` | `_spaceCombat` | Mentak ambush |
| `onSpaceCombatRound(systemId, attacker, defender)` | `_spaceCombat` loop | Letnev munitions-reserves |
| `onActionCardDraw(player, cards)` | `_drawActionCards` | Yssaril scheming |
| `onShipsEnterSystem(systemId, moverName)` | `_tacticalAction` after movement | Naalu foresight |
| `onTransactionComplete(player)` | `_resolveTransaction` | Mentak pillage |

### Needed for Phase 2

| Hook | Called From | Used By |
|------|-----------|---------|
| `onPlanetGained(player, planetId, systemId)` | `_establishControl` | Saar, L1Z1X, Winnu |
| `onStatusPhase(player)` | `statusPhase` | Arborec |
| `onGroundCombatStart(systemId, planetId, attacker, defender)` | `_groundCombat` | L1Z1X |
| `onGroundCombatRound(systemId, planetId, attacker, defender)` | `_groundCombat` loop | Yin |
| `onAgendaRevealed(agendaCard)` | `_resolveAgenda` | Xxcha |
