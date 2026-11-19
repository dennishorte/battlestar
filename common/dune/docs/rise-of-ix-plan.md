# Rise of Ix implementation plan

Make `useRiseOfIx` play Rise of Ix on top of Dune: Imperium — Uprising. The rules to implement are `common/dune/docs/living_rules/20_rise_of_ix.md` (and the matching entry in `common/dune/res/livingRules.js`). Card, tech, leader, and contract data already exist. The board, the shipping track, tech buying, dreadnoughts, and several leader abilities do not.

Tests stay integration tests: `fixture({ useRiseOfIx: true })` → `setBoard()` → `game.run()` → `choose()` / `action()` → `testBoard()`. A game with the flag off must keep today's behavior.

This plan was revised after review against the current code. The corrections are in the phases below, not in a separate list.

## Locked decisions

- A dreadnought that loses the conflict returns to that player's garrison, never the supply. A dreadnought parked on a control space also returns to the garrison at the end of the next round's Combat, including a round whose combat is skipped because nobody has a unit in the conflict.
- One exception: Detonation Devices. When you win a conflict with a dreadnought, you may send one dreadnought back to your supply for 1 VP instead of parking it. Offer that choice before parking.
- A normal game uses no Rise of Ix conflict cards. Epic mode adds Economic Supremacy as the fifth Conflict III. Do not add Skirmish I, Skirmish II, or Trade Monopoly until something uses them.
- Tessia Vernius's four snooper rewards are one shared list, taken top to bottom, one at a time. No reward belongs to an influence number or a faction. "This token's Influence track" means the faction that just crossed 2.
- Rivals, House Hagal, solo play, and the six-player team mode are out of scope.
- The Uprising board is the board. The overlay covers only Accept Contract and Shipping.

## Calls to build with

- If every control space already holds a dreadnought, the winner parks nothing. Every dreadnought from that conflict returns to the garrison, unless Detonation Devices sends one to the supply.
- Tessia fires when influence on a faction goes from below 2 to 2 or higher, including a jump from 1 to 3. Going from 2 to 3 does not fire. Dropping below 2 and crossing 2 again takes the next reward. After four rewards, further crossings do nothing. Rewards 2 and 4 pay that faction's 4-influence bonus only (Emperor: a spy, Guild: 3 Solari, Bene Gesserit: an intrigue card, Fremen: a water). They do not grant the alliance or its victory point. `applyFactionBonus` in `systems/factions.js` is not exported; export a payout used here, and do not call the alliance check.
- Duplicity's "faction where you have a Snooper" means a spy on a post that touches that faction's spaces: J Emperor, K Spacing Guild, L Bene Gesserit, M Fremen.
- Epic is its own flag, `useEpic`, stored on the lobby and copied onto the game. It only changes setup when Rise of Ix is also on. The wiring is the section below.
- The shipping track, Smuggling, and Interstellar Shipping are part of Rise of Ix. They are not part of the CHOAM contract module. `dune.js` already forces `useCHOAM` on. Do not add a lobby switch to turn contracts off.
- The troop pool stays 12. Epic moves 2 from supply to garrison on the player during setup (garrison 5, supply 7). Do not change `STARTING_TROOPS_IN_GARRISON` or `STARTING_TROOPS_IN_SUPPLY` in `constants.js`.
- The 3 Solari on the Dreadnought space is the cost to place the agent, same as any other space cost. Commission and Acquire Tech are then optional. The tile's spice is a separate payment. The player pays the 3 Solari even if they only buy a tile.

## What already works

- `useRiseOfIx` is already stored on the game and on the lobby. `DuneFactory` and `factoryFromLobby` in `dune.js` copy it, `testutil.js` passes it through, and `SettingsDune.vue` has the checkbox. The checkbox is `disabled` and labeled "not yet implemented," so a lobby cannot turn it on yet. There is no `useEpic` anywhere on that path.
- `SOURCE_TO_SETTING` maps `'Rise of Ix'` to that flag. `getCards` then keeps only compatibility `All` or `Uprising`, and then filters by source. Cards with compatibility `All` and source `Rise of Ix` already enter when the flag is on. Most intrigue cards, the non-shipping non-tech imperium cards, Armand, Ilesa, Tessia, and Yuna are in this group.
- Yuna's starting water works: setup gives 1 water, then leader assignment clears it. Her Solari bonus is not done. `onGainSolari` adds 1 on every call and does not check whose turn it is. Conflict Solari goes through `resolveEffect` and would get the bonus. The control bonus uses `incrementCounter` and never calls the hook, so Arrakeen and Spice Refinery Solari on her turn would not. Limit the bonus to Solari she gains on her own agent or reveal turn, including one Dividends gain of 5 (she ends at 6) and including control-bonus Solari paid on her turn. Off-turn gains and combat gains do not get it. Slig Farmer is an Immortality card with no behavior. Do not build it for this expansion.
- `systems/choam.js` drops `riseOfIxSpecific` contracts when the expansion is off. That is right for the flag off, and the wrong shape when the flag is on (phase 8).
- Eighteen tech files have `source: 'Rise of Ix'`. Some already have `onAcquire`. Their ongoing lines are still prose. Ten other tiles have `source: 'Bloodlines'` and `compatibility: 'Rise of Ix'`. Those are not part of this box.

## What the flag does not do yet

Widening compatibility without keeping the source check would pull in the Bloodlines tiles and `deliver-supplies-2`. Keep both checks. A card enters only when its source is active and its compatibility is allowed.

These stay out of every game today, because compatibility is not `All` or `Uprising`:

- The 18 Rise of Ix tech tiles. Seventeen use `Rise of Ix`. Troop Transports uses `Shipping (Rise of Ix)` and source `Rise of Ix`.
- Shipping and tech imperium cards (`Shipping (Rise of Ix)`, `Tech (Rise of Ix)`).
- Control the Spice, a starter with `countPerPlayer: 1`. Allowing its compatibility without a separate exclusion puts it in every starting deck. The Epic swap is the only legal way it enters.
- Hundro and Rhombur.
- Foldspace (`source: 'Base'`, `compatibility: 'Dune Imperium (Base Only)'`, `count: 6`). There is no Foldspace zone. `deckEngine` only builds Prepare the Way and The Spice Must Flow. Do not add `Dune Imperium (Base Only)` to the general allow list.

There are no board spaces for Dreadnought, Tech Negotiation, Smuggling, or Interstellar Shipping. Assembly Hall and Gather Support are always present. Observation post `I` still points at those two spaces.

The screen will not follow a server-side filter by itself. `DuneActionSpaces.vue` and `DuneGame.vue` import `dune.res.boardSpaces` directly.

There is no freighter, shipping track, tech stack, negotiator, or dreadnought state. Combat strength treats "no troops and no sandworms" as no swords. `setRevealStrength` in `systems/strengthBreakdown.js` returns 0 before recording swords. The same gate is in the reveal preview, in `units-in-conflict`, and in Gurney's strength. `phases/combat.js` leaves combat immediately when nobody has a troop or a sandworm, and that path does not run cleanup.

`deckEngine` always builds 1 Conflict I + 5 Conflict II + 4 Conflict III, and `slice` after a shuffle would drop a random Conflict III. Endgame is 10 VP. The tie-break is spice, then Solari, then water, then garrison troops, with no Chaumurky check.

Leader text was corrected earlier. The play code was not. Armand's reveal hook trashes a card without counting agents, and he has no Conscript signet. Ilesa, Tessia, Hundro, and Rhombur have no hooks. There is no round-start leader hook. `onAssign` runs when the leader is chosen, which is too early for Hundro in Epic.

Several intrigue cards already enter an Ix game and still skip the expansion half of their text: Machine Culture, Expedite, Advanced Weaponry, Cannon Turrets, Diversion, and Grand Conspiracy. Full-Scale Assault asks for swords per dreadnought in the conflict, and `countPerVariable` has no dreadnought case, so it adds 0.

## Phase 1 — Let the right cards in

Change the inclusion rule. Do not drop the source filter.

When `useRiseOfIx` is on, also allow compatibility `Rise of Ix`, `Shipping (Rise of Ix)`, and `Tech (Rise of Ix)`, and still require the card's source to be active. When the flag is off, today's filter stays. The ten Bloodlines tiles that reuse the `Rise of Ix` compatibility string stay out unless Bloodlines itself is on, and even then they are not shuffled into the Ix stacks. The three stacks are the 18 files whose source is `Rise of Ix`.

Do not add the three unused conflict cards in this phase. Economic Supremacy is added with Epic (phase 9), by name, so a shuffle cannot drop it.

Foldspace stays out of the Imperium row. When Ilesa is in the game, create a six-card Foldspace pile that only her signet can draw from (phase 7). Nobody else can gain one. An empty pile means the signet does nothing.

Control the Spice stays out of starting decks except the Epic swap of one Dune, the Desert Planet. Its `agentEffects` already run. Exclude it by id, not by leaving its compatibility blocked, so Epic can still find the card.

Tests: with the flag off, deck counts match today. With the flag on, the 35 imperium copies, 17 intrigue cards, 18 Rise of Ix tech tiles, and six leaders are present. The conflict deck is still the Uprising deck. Control the Spice is not in a starting deck. No Bloodlines tech tile is in an Ix stack.

## Phase 2 — Board and pieces

Add the four spaces only when the flag is on, and omit Accept Contract and Shipping in that same case. Icons and requirements are the table in the living rules. None of the four is a combat space. Interstellar Shipping requires 2 Spacing Guild influence. The Dreadnought space costs 3 Solari to send the agent. Commission and Acquire Tech are optional after that.

Retarget observation post `G` to Smuggling and Interstellar Shipping. Add one new post for Tech Negotiation and Dreadnought. Do not leave `G` pointing at the covered spaces, and do not add two posts on top of the old `G`.

Per player, on the ephemeral player state:

- Dreadnoughts: 2 in supply, 0 in garrison, 0 in the conflict.
- Negotiators: 0. A negotiator is a troop taken from supply onto the Ix banner. It is not a recruit source.
- Freighter: start on the bottom space (0 bottom, 1 middle, 2 top).

On `game.state`:

- Three tech stacks of six, built only from source `Rise of Ix`, tops face up. Empty stacks stay empty.
- Tiles each player owns, and which of those are face down this round.
- Which control space holds a parked dreadnought, who owns it, and the round it parked. While it is there, that player is the controller for visit income and for the defensive troop. The marker underneath is stored and restored when the dreadnought leaves. Do not keep a second map that `controlMarkers` ignores. Visit income in `playerTurns.js` and the defensive troop in `roundStart.js` both read `controlMarkers` today.

This phase moves a commissioned dreadnought from supply to garrison. It does not deploy one. Deployment waits for the shared cap in phase 4. The Dreadnought space is not a combat space, so a dreadnought commissioned there never deploys on that turn.

## Phase 3 — Buying tech

New `systems/tech.js`. Acquire Tech, from a space or a card, is the only way to take a tile. The player picks any face-up top tile, pays, takes the one-time acquire effect, and reveals the next tile. No ownership cap.

Cost never goes below 0.

- An icon discount of 1 or 2 does not stack with a second icon discount.
- Each negotiator returned to supply is −1 and does stack with the one icon discount. You cannot take a negotiator back except as part of a purchase.

Appropriate pays Solari instead of spice for one tile, and only if the player has 2 Emperor influence. It cannot mix the two currencies on that tile. Negotiators reduce the Solari cost the same way.

The tile files have an `effect` string and, for some, `onAcquire`. They have no timing field and no flip flag. Add an explicit field. Do not guess a flip icon from the sentence "once per round."

Timing:

- Acquire effect: once, on purchase.
- Named timing (reveal, win a conflict, round start, endgame): fire from that phase.
- Standing abilities, not one-shots: Spaceport (acquired cards may go on top of the deck) and Restricted Ordinance (+4 swords with a High Council seat).
- No stated time, once during one of your turns: Spy Satellites' trash-for-a-VP. Its other line is endgame only.
- Flip icon: once per round, on an agent turn or a reveal turn. Turn face down when used, face up at round start.

Chaumurky, in `phases/recall.js`: if exactly one tied player owns it, that player wins. Do not compare spice, Solari, water, or garrison troops.

Split the tile work. First commit is the purchase engine and the tiles whose acquire effect or standing ability can be tested without combat. Tiles that pay off when you win a conflict, including Detonation Devices, wait until phase 4 can park a dreadnought.

## Phase 4 — Dreadnoughts in combat

One shared "has a unit in the conflict" check. Use it in `DunePlayer` strength, `setRevealStrength`, the reveal preview, `units-in-conflict`, Gurney, and the combatant filter in `combat.js`. A dreadnought in the conflict counts even when that player has no troops there, so swords are recorded and combat intrigue is legal. A dreadnought still in the garrison adds nothing. `most-deployed-troops` stays troops only.

Strength is 3, or 4 for Rhombur. `countPerVariable` needs a dreadnought case so Full-Scale Assault's swords actually add.

`deployUnits` caps troops by comparing garrison now with garrison at turn start. A separate dreadnought pile is invisible to that cap. Share one cap across troops and dreadnoughts: anything recruited or commissioned this turn, plus up to two more from the garrison. Second Wave's "up to two units" is part of that same unit check. It currently takes only troops.

After combat, troops still return to the supply. Dreadnoughts do not, except through Detonation Devices.

- Loss, or a win with no dreadnought in the conflict: dreadnoughts in the conflict return to the garrison.
- Win with at least one dreadnought in the conflict: if the winner has Detonation Devices, they may send one dreadnought to the supply for 1 VP instead of parking. Otherwise they park one on a control space that does not already have a dreadnought (Arrakeen, Spice Refinery, Imperial Basin). Any other dreadnought from that conflict returns to the garrison.
- If combat is skipped, still run the parked-dreadnought return. `combatPhase` currently returns before cleanup when nobody has a troop or a sandworm. A dreadnought whose return waits only inside that cleanup stays out forever on a quiet round. Do not return it at recall. Recall is after the next round's agent turns would have wanted it still parked. Return it at the end of combat, including the skipped path, on the round after it parked.

"Unit" on a Rise of Ix card means a troop or a dreadnought. A card that says "troop" does not move or count a dreadnought. Uprising's existing "unit" (troop or sandworm) also includes a dreadnought while this expansion is on.

## Phase 5 — Shipping track

New `systems/shipping.js`. Each freighter icon is a choice:

- Advance one space. No advance from the top space.
- Recall to the bottom and take the current space plus every space below it, in any order.

Advancing does not pay. Recalling from the bottom pays only the bottom reward.

- Bottom: Dividends (you 5 Solari, each opponent 1) or 2 spice.
- Middle: recruit 2 troops and 1 influence with one faction.
- Top: Acquire Tech at a 2 spice discount.

Troops recruited from the track go to the garrison. If the agent this turn is on a combat space, they may be deployed under the phase 4 cap. Interstellar Shipping is not a combat space.

Troop Transports adds one troop to a shipping-track recruit. Those extra troops follow the same deploy rule. They do not deploy from a non-combat space.

Cards and the Hundro signet call the same `moveFreighter` function.

## Phase 6 — Cards that already have text and no behavior

Split this. One commit for the three icon rules. One for the shipping and tech imperium cards. One for the intrigue cards that already enter the deck and skip their expansion text.

Icon rules:

- Discard, when it is a cost: from hand, not an intrigue card. If the player does not pay it, they do not get the effect. Guild Chief Administrator currently discards and then trashes anyway. The trash target may be hand, play, or discard. An Unload card discarded or trashed this way still fires its reveal box.
- Unload: hook `deckEngine.discardCard` and `trashCard` only. End-of-turn cleanup uses `moveTo`, not those functions. Do not hook `moveTo`, or every cleanup would replay reveal boxes.
- Infiltration: the icon actually used lets the agent land on a space occupied by an opponent's agent of that same icon. It does not pass your own agent or The Voice. `allIcons` and a Dispatch an Envoy faction icon do not ignore occupancy.

Imperium cards keyed by `hasShipping`, `hasTech`, `hasUnload`, and `hasInfiltration` call `moveFreighter` or `acquireTech`. A card whose text does not match gets its own `agentEffect` or `revealEffect`. Appropriate's Acquire Tech line also requires 2 Emperor influence.

Intrigue that already enters and is still a log line or a partial effect: Machine Culture, Expedite, Advanced Weaponry, Cannon Turrets, Diversion, Grand Conspiracy. Grand Conspiracy is three conditions for 1 VP and all four for 2 VP. List any card left as text-only before calling the expansion playable.

## Phase 7 — Leaders

Hooks go on the leader file. `systems/leaderAbilities.js` already dispatches them. Add a round-start dispatch. Ilesa's second turn needs a turn counter. `onAgentTurnStart` exists. `onAssign` is the wrong time for Hundro.

- Armand: on the reveal turn, offer the trash only when he has at least two agents on green, purple, or yellow spaces. The colors do not have to match. Conscript: acquire a card that costs 3 persuasion or less. With no `resolveSignetRing`, the signet logs the text and stops.
- Ilesa: at round start, set a card aside from hand. At the start of her second turn, reveal it and return it to hand. If that card sends the agent and it has exactly one agent icon, she gains 1 spice. Otherwise, if it sent the agent, she gains 1 Solari. If she does not use the card, she gains nothing. If her first turn is a reveal turn, the set-aside card joins the revealed cards and she gains nothing. Guild Contacts: pay 1 Solari and take one Foldspace from her six-card pile into her discard. If the pile is empty, the signet does nothing.
- Tessia: store the next reward index. Fire only on a crossing to at least 2, as defined above. Duplicity uses the snooper check above.
- Hundro: look at the top two intrigue cards, keep one, put the other back on top. In a normal game this is at game start, after the intrigue deck exists, not at leader selection. In Epic it is after every player has drawn their starting intrigue card. Couriers: pay 1 spice, move the freighter once.
- Rhombur: dreadnought strength 4. Signet: Acquire Tech, or Tech Negotiation's discount-or-negotiator choice. The signet does not grant the +1 persuasion for still having an agent on Tech Negotiation.
- Yuna: the turn-limited Solari bonus from the calls section. No new signet work.

## Phase 8 — CHOAM contracts

Both flags are on in any real lobby, because `useCHOAM` is forced on. The shipping track does not depend on that.

The ten contracts are the `riseOfIxSpecific` files whose source is `Uprising`. `deliver-supplies-2` is Bloodlines and stays out.

Build the contract deck from the other Uprising contracts and fill the market as today. Shuffle those ten, deal two to each player, and each player keeps one face up. The rest leave the game. The kept contract is that player's, not a market card.

Do not call this done until the triggers match the new spaces. Smuggling and Interstellar Shipping currently trigger on the existing `shipping` space. Dreadnought and Tech Negotiation have no trigger. Dreadnought, Interstellar Shipping, and High Council 2 reward an Ixian Ambassador, which is a Bloodlines card and will not be in this deck. Give those rewards a payout that exists in an Ix-only game.

This phase needs the new spaces from phase 2. It does not run beside the tech engine.

## Lobby and game settings

Two flags. `useRiseOfIx` already exists end to end, except the checkbox is disabled. `useEpic` does not exist yet. Both have to survive three steps: the lobby form writes `lobby.options`, starting a game copies those options onto `game.settings`, and a rematch copies `game.settings` back onto a new lobby. `api/src/services/game_service.js` copies every settings key except name, players, seed, and series fields. `SettingsDune.vue` then replaces the whole `lobby.options` object inside `optionsChanged`. A key missing from that object is wiped the first time anyone touches a checkbox, including on a rematch.

`useRiseOfIx`, already wired:

- `SettingsDune.vue`: `models.useRiseOfIx` starts false. `created()` reads `lobby.options.useRiseOfIx`. `optionsChanged()` writes it back with the other module flags and calls `save()`.
- `dune.js`: `DuneFactory` sets `data.settings.useRiseOfIx`. `factoryFromLobby` reads `lobby.options.useRiseOfIx`.
- `testutil.js`: `fixture({ useRiseOfIx: true })` passes the flag into `DuneFactory`.

Leave that path in place. Phase 10 only enables the checkbox and removes the "not yet implemented" label.

`useEpic`, add the same path. Do this at the start of phase 9, before any Epic setup rule:

- `SettingsDune.vue` default `models.useEpic` to false. `created()` sets it from `Boolean(lobby.options.useEpic)`. `optionsChanged()` includes `useEpic` in the object it assigns to `lobby.options`, next to `useRiseOfIx`, `useBaseGameCards`, `useImmortality`, `useBloodlines`, and `imperiumRowRefresh`. Keep those existing keys. That assignment replaces the object, so dropping one drops it from the saved lobby.
- The Epic checkbox sits under Rise of Ix. It is disabled unless Rise of Ix is checked. Unchecking Rise of Ix sets `useEpic` to false and saves. Checking Epic while Rise of Ix is off does nothing.
- `DuneFactory` sets `data.settings.useEpic` from `settings.useEpic || false`. `factoryFromLobby` sets it from `lobby.options?.useEpic || false`.
- `testutil.js` passes `useEpic: options.useEpic || false` into `DuneFactory`, the same way it passes `useRiseOfIx`. The later `...options` spread does not remove the need for `DuneFactory` to copy the field onto `data.settings`.
- Game code reads `game.settings.useEpic` only together with `game.settings.useRiseOfIx`. Epic rules do not run when Rise of Ix is off, even if a saved lobby still has `useEpic` true.

No API whitelist has to change. The lobby controller stores `req.body.options` as given. Do not add a CHOAM checkbox. `useCHOAM` stays forced on in both factories.

## Phase 9 — Epic mode

Wire `useEpic` through the lobby and both factories first, as in the section above. Then, when both `useEpic` and `useRiseOfIx` are on:

- Play to 12 VP. `phases/recall.js` reads the target from the setting. An empty conflict deck still ends the game.
- Conflict deck: no Conflict I. Five random Uprising Conflict II cards. Five Conflict III cards: Uprising's four, plus Economic Supremacy, included by name. Add that one conflict module here. Do not `slice` a shuffled tier that might drop it.
- Each player swaps one Dune, the Desert Planet for Control the Spice.
- Each player draws one intrigue card. Hundro uses Intelligence after those draws.
- That player's garrison starts at 5 and supply at 7.

The deck, the swap, the garrison, and the victory target do not need Hundro. His Epic timing is the last step of this phase, after phase 7.

Epic without Rise of Ix does nothing.

## Phase 10 — Board UI

The engine comes first. Before touching the screen, a headless game must commission a dreadnought, buy a tile, recall a freighter, park a dreadnought, and win a fight with only a dreadnought in the conflict, swords counted and a combat intrigue legal. One leader ability from phase 7 must have a test.

- Enable the Rise of Ix checkbox: remove `disabled` and the "not yet implemented" label. The Epic checkbox from phase 9 stays disabled until Rise of Ix is checked. Confirm a new lobby saves `useRiseOfIx` and `useEpic`, a started game has both on `game.settings`, and a rematch lobby still has both after another checkbox change.
- `DuneActionSpaces.vue` and `DuneGame.vue` read the static `dune.res.boardSpaces`. Hiding Accept Contract and Shipping means filtering that list when the flag is on, not only `game.state.boardSpaces`.
- Show the Ix board: three stacks with the top tile face up, negotiators on the banner, and owned tiles, face down when flipped.
- Show each freighter, dreadnoughts in garrison and in the conflict, and a parked dreadnought on its control space.
- Reuse `DuneBoardState`, `DuneConflict`, and the existing resource icons.

Verify in the browser: start a Rise of Ix lobby, send an agent to each new space, buy a tile, move a freighter, fight with only a dreadnought, and park it. Then start a lobby with the flag off and confirm Accept Contract, Shipping, and the conflict deck are unchanged.

## Order

| Phase | Depends on | Commit |
|---|---|---|
| 1. Card gate, Foldspace pile, Control the Spice exclusion | — | one |
| 2. Board, one retargeted post, one new post, piece state | 1 | one |
| 3. Tech purchase, then tiles that do not need combat | 2 | purchase engine, then those tiles |
| 4. Shared unit check, deploy cap, parking, Detonation Devices | 2 | one, then the win-the-conflict tiles |
| 5. Shipping track | 2, 3 (the top reward buys tech) | one |
| 6. Icon rules, then imperium hooks, then the intrigue stubs | 3, 4, 5 | three |
| 7. Leaders, including Conscript and the Foldspace draw | 3, 4, 5, and the pile from 1 | one |
| 8. CHOAM keep-one, with working triggers | 2 | one |
| 9. `useEpic` on the lobby, both factories, and the fixture; then the Epic deck, swap, garrison, and 12 VP. Hundro's timing last | 1, and 7 for Hundro only | one |
| 10. UI | the headless gate in the phase 10 section | one |

Phases 4 and 5 can proceed once phase 2 and the tech purchase exist. Phase 4's deploy cap is what makes "commissioned this turn" deployable. Phase 2 does not pretend to deploy.

## Left out on purpose

- Rival cards and the House Hagal icon on tech tiles.
- The original full-board overlay.
- Skirmish I, Skirmish II, and Trade Monopoly.
- Slig Farmer and the other Immortality behavior.
- A lobby switch to turn the CHOAM contract module off.
- Rewriting inventory CSVs.
