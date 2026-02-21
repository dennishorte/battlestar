# Faction Status

25 factions. 444 tests passing across 23 test files.

## Fully Implemented (24)

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
| Arborec | `mitosis` (place 1 infantry in status phase) | 1 |
| Clan of Saar | `scavenge` (1 TG on planet gain) | 1 |
| Embers of Muaat | `star-forge` (component action: fighters/destroyer from war sun), `gashlai-physiology` (move through supernovae) | 3 |
| Yin Brotherhood | `devotion` (destroy ship for hit), `indoctrination` (replace infantry at ground combat start) | 2 |
| L1Z1X Mindnet | `assimilate` (replace enemy PDS/docks), `harrow` (bombardment during ground combat rounds) | 2 |
| Winnu | `blood-ties` (free custodians removal), `reclamation` (PDS+dock on Mecatol Rex) | 2 |
| Xxcha Kingdom | `peace-accords` (gain unoccupied adjacent planet after diplomacy), `quash` (discard and replace agenda) | 2 |
| Ghosts of Creuss | `quantum-entanglement` (home has alpha+beta wormholes), `slipstream` (+1 move from wormhole systems) | 2 |
| Nekro Virus | `galactic-threat` (excluded from voting, predicts outcome for tech), `technological-singularity` (gain tech on unit kill), `propagation` (cannot research normally) | 3 |
| Argent Flight | `zeal` (votes first with bonus votes), `raid-formation` (excess AFB hits damage ships) | 2 |
| Empyrean | `voidborn` (move through nebulae) | 1 |
| Mahact Gene-Sorcerers | `edict` (capture command token on combat win, +fleet limit) | 1 |
| Naaz-Rokha Alliance | `distant-suns` (extra exploration with mech), `fabrication` (purge fragments for tokens/relics) | 2 |
| Nomad | `future-sight` (gain TG when voted-for outcome wins) | 1 |
| Titans of Ul | `terragenesis` (place sleeper after exploration), `awaken` (replace sleeper with PDS on activation) | 2 |
| Vuil'raith Cabal | `devour` (capture destroyed units), `amalgamation` (return captured unit to place own), `riftmeld` (return captured unit for unit upgrade tech) | 3 |

## Partially Implemented (2)

| Faction | Done | Missing |
|---------|------|---------|
| Emirates of Hacan | `guild-ships`, `masters-of-trade` | `arbiters` (action cards in transactions) |
| Council Keleres | `council-patronage` (replenish commodities + 1 TG at strategy phase) | `the-tribunii` (sub-faction selection), `laws-order` (law mechanics) |

## Deferred Abilities

These abilities require subsystems not yet built:

| Faction | Ability | Why Deferred |
|---------|---------|--------------|
| Mahact Gene-Sorcerers | `imperia` | Needs commander effect registry (commanders only track lock state) |
| Mahact Gene-Sorcerers | `hubris` | Alliance/promissory note mechanics not fully implemented |
| Nomad | `the-company` | Needs agent effect system (agents only track ready/exhausted) |
| Empyrean | `aetherpassage` | Cross-player movement permissions |
| Empyrean | `dark-whispers` | Needs promissory note duplication at setup |
| Ghosts of Creuss | `creuss-gate` | Map setup handles tile placement |
| Titans of Ul | `coalescence` | Forced-combat mechanics |
| Naaz-Rokha Alliance | `distant-suns` (full) | Exploration bonus with mech — basic version implemented, full needs mech presence tracking |

## No Data (1)

| Faction | Notes |
|---------|-------|
| Council Keleres | Sub-faction selection, variable setup (`the-tribunii`) |

---

## Hooks

### All Hooks

| Hook | Location | Used By |
|------|----------|---------|
| `onSpaceCombatStart(systemId, attacker, defender)` | `_spaceCombat` | Mentak ambush |
| `onSpaceCombatRound(systemId, attacker, defender)` | `_spaceCombat` loop | Letnev munitions-reserves |
| `afterSpaceCombatRound(systemId, attacker, defender)` | `_spaceCombat` after hits | Yin devotion |
| `onActionCardDraw(player, cards)` | `_drawActionCards` | Yssaril scheming |
| `onShipsEnterSystem(systemId, moverName)` | `_tacticalAction` after movement | Naalu foresight |
| `onTransactionComplete(player)` | `_resolveTransaction` | Mentak pillage |
| `onPlanetGained(player, planetId, systemId, structureCounts)` | `_establishControl` | Saar scavenge, L1Z1X assimilate, Winnu reclamation |
| `onStatusPhaseStart(player)` | `statusPhase` | Arborec mitosis |
| `onGroundCombatStart(systemId, planetId, attacker, defender)` | `_groundCombat` | Yin indoctrination |
| `onGroundCombatRoundEnd(systemId, planetId, attacker, defender)` | `_groundCombat` loop | L1Z1X harrow |
| `onAgendaRevealed(agenda)` | `_resolveAgenda` | Xxcha quash |
| `afterDiplomacyResolved(player)` | `_diplomacyPrimary`, `_diplomacySecondary` | Xxcha peace-accords |
| `getCustodiansCost(player)` | `_establishControl`, `_autoPlaceGroundForces` | Winnu blood-ties |
| `canMoveThroughSupernovae(playerName)` | `Galaxy.findPath` | Muaat gashlai-physiology |
| `canMoveThroughNebulae(playerName)` | `Galaxy.findPath` | Empyrean voidborn |
| `getMovementBonus(playerName, fromSystemId)` | `_movementStep` | Creuss slipstream |
| `getHomeSystemWormholes(systemId)` | `Galaxy.getAdjacent`, `_getAdjacentSystems` | Creuss quantum-entanglement |
| `onSystemActivated(playerName, systemId)` | `_tacticalAction` | Titans awaken |
| `onUnitDestroyed(systemId, unit, destroyerName)` | `_assignHits`, `_assignGroundHits` | Nekro singularity, Vuil'raith devour |
| `afterCombatResolved(systemId, winner, loser, type)` | `_spaceCombat`, `_groundCombat` | Mahact edict |
| `getAgendaParticipation(votingOrder)` | `_resolveAgenda` | Nekro exclusion, Argent zeal |
| `getVotingModifier(player)` | `_resolveAgenda` | Argent zeal |
| `onAgendaVotingStart()` | `_resolveAgenda` | Nekro prediction |
| `onAgendaOutcomeResolved(agenda, outcome, playerVotes)` | `_resolveAgenda` | Nekro reward, Nomad future-sight |
| `onStrategyPhaseStart(player)` | `strategyPhase` | Keleres council-patronage |
| `getRaidFormationExcessHits(shooterName, hits, destroyed)` | `_antiFighterBarrage` | Argent raid-formation |
| `getExplorationBonus(player, planetId)` | `_explorePlanet` | Naaz-Rokha distant-suns |
| `afterExploration(player, planetId)` | `_explorePlanet` | Titans terragenesis |
| `canResearchNormally(player)` | `_researchTech` | Nekro propagation |
| `getCapturedTokenFleetBonus(player)` | `_getFleetLimit` | Mahact edict |

## State Systems

| State Key | Type | Used By |
|-----------|------|---------|
| `state.sleeperTokens` | `{ planetId: ownerName }` | Titans of Ul |
| `state.capturedUnits` | `{ playerName: [{ type, originalOwner }] }` | Vuil'raith Cabal |
| `state.capturedCommandTokens` | `{ playerName: [otherPlayerName, ...] }` | Mahact Gene-Sorcerers |
| `state.nekroPrediction` | `{ playerName, outcome }` | Nekro Virus |
