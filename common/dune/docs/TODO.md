# Dune Imperium: Uprising — Implementation TODO

## Board Space Data
- [x] Populate `res/boardSpaces.js` with all 22 board spaces
- [x] Populate `res/observationPosts.js` with 13 spy post connections (A-M)
- [x] Wire up choice effects (Spice Refinery, Sietch Tabr, Hagga Basin, Deep Desert, Gather Support)
- [x] Wire up simple effects: influence-choice, high-council, sword-master, trash-card, steal-intrigue, vp, influence, control
- [x] Wire up remaining complex effects: intrigue-trash-draw, recall-agent, maker-hook, break-shield-wall, sandworm
- [x] Wire up contract effect (via CHOAM module)

## Card Agent Effects
- [x] Wire up card `agentAbility` execution during agent turns via `resolveCardAgentAbility`
- [x] Build agent ability text parser (`systems/cardEffects.js`) for simple patterns
- [x] Handle conditional abilities (If/With patterns, faction synergies, turn tracking)
- [x] Turn tracking state: spy recalls, contract completions, spice gained, maker/faction space visits
- [x] Extended condition checks: high council, swordmaster, alliance, maker/faction space, persuasion, garrison, spies on board

## Card Reveal Effects
- [x] Wire up `revealAbility` via `resolveCardRevealAbility` — parses simple effects and faction bonds
- [x] Conditional reveal abilities parsed via same If/With system

## Combat Reward Distribution
- [x] Parse and execute conflict card rewards (first/second/third place)
- [x] Winner takes conflict card into supply
- [x] Location control: winner gains control marker for location-based conflicts
- [x] Battle icon matching: check for pairs when winner takes conflict card (+1 VP)
- [x] Sandworm reward doubling (double most rewards, not control or battle icons)

## Combat Intrigue Effects
- [x] Execute simple combat intrigue effects via parser (swords, resources)
- [x] Retreat troops effect type for combat intrigue

## Spy System
- [x] Create `systems/spies.js`
- [x] Spy placement on observation posts
- [x] Infiltrate: recall spy to ignore occupied board space
- [x] Gather Intelligence: recall spy to draw a card
- [x] Spy agent icon: send agent to space connected to your spy's post
- [x] Wire spy choices into agent turn flow

## Leaders
- [x] Create `systems/leaders.js` with ability dispatch
- [x] Leader selection during setup (choose or random)
- [x] Signet Ring card triggers leader's signet ring ability
- [x] Leader passive ability hook system (`systems/leaderAbilities.js`)
- [x] 16 leader abilities implemented

## Intrigue Cards (Plot/Endgame)
- [x] Plot intrigue: offered at start of turn, after effects resolve, and at end of turn
- [x] Endgame intrigue: prompted before final scoring in `endGame()`
- [x] Simple intrigue effects execute via parser; complex ones logged as memo
- [x] Intrigue effects parsed via same conditional system (If/With patterns)

## Setup Completeness
- [x] Deal objective cards to players, determine first player from objective
- [x] Defensive bonus: deploy 1 troop from supply when your controlled location's conflict is revealed
- [x] Swordmaster acquisition effect (gain 3rd agent, dynamic cost 8/6)
- [x] High Council seat effect (take seat; 2nd visit gives 2 spice + 1 intrigue + 3 troops)
- [x] The Spice Must Flow acquisition bonus (+1 VP)

## Sandworms
- [x] Maker Hooks token tracking per player
- [x] Sandworm summoning effect (deploys sandworms to conflict)
- [x] Shield Wall detonation effect (break-shield-wall)
- [x] Sandworm deployment restriction: maker-hook check in choice filter
- [x] Sandworm summoning blocked at protected conflict locations when shield wall intact

## CHOAM Module
- [x] Create `systems/choam.js`
- [x] Contract setup (shuffled deck, 2 face-up market)
- [x] Taking contracts from market
- [x] Contract reward parsing and execution
- [x] Auto-completing contracts (board space, harvest, immediate, TSMF, alliance triggers)
- [x] Contract completion count tracking

---

# Remaining Implementation Plan

## Feature 1: Paul Atreides — Prescience ✅ (just committed sandworm, Paul is next)
- Peek top of deck at start of each turn, log privately
- Signet Ring "Draw 1 card" already works

## Feature 2: Feyd-Rautha — Training Track
- Branching graph: Start→A|B, A→C, B→C, C→D|E, D→Finish, E→F, F→Finish
- Rewards: A: pay 1 solari→trash card, B: place spy, C: trash card, D: trash card, E: place spy, F: +2 spice, Finish: +1 troop + place spy
- State: `game.state.feydTrack[playerName]` = current node
- Signet Ring triggers movement: present valid next nodes, resolve reward

## Feature 3: Lady Jessica — Other Memories / Reverend Mother
- **Front (Lady Jessica):**
  - Leader ability: On BG board space, may return all memories → draw card per memory → flip
  - Signet Ring: Pay 1 spice → +1 intrigue, move 1 troop from supply to memories
- **Back (Reverend Mother):**
  - Leader ability: Once/turn, on BG or Fremen space, pay 1 water → repeat space effects
  - Signet Ring: Pay 1 spice → +1 water
- State: memories count, flipped boolean

## Feature 4: Shaddam Corrino — Sardaukar Commander Exclusivity
- At CHOAM setup: if Shaddam selected, set aside both "Sardaukar" contracts
- Only Shaddam can take them
- Shaddam requires `useCHOAM` to be selectable
- Note: Sardaukar Commander cards (sardaukar.js) are Bloodlines — skip

## Feature 5: Parser — Discard-as-cost patterns (~16 effects)
- "Discard a card -> Effect", "Discard N cards -> Effect"
- Extend cost→effect chain to accept discard as cost

## Feature 6: Parser — Specific faction influence (~8 effects)
- "+1 Influence with Bene Gesserit", "+1 Fremen Influence"
- Add to parseSingleAbility

## Feature 7: Parser — Multi-line compound effects (~25 effects)
- Split on `\n`, handle "Having X Alliance: Effect", Fremen Bond multi-line

## Feature 8: Parser — Pay/Lose cost patterns (~20 effects)
- "Lose N troops -> Effect", "Lose N Influence -> Effect"
- "Spend N Spice -> Effect", "N Resource -> Effect" (no Pay prefix)
- New effect types: `lose-troops`, `lose-influence`

## Feature 9: Parser — Deploy and opponent effects (~15 effects)
- "Deploy up to N troops from garrison to Conflict"
- "Each opponent discards a card" / "Each opponent loses 1 troop"
- "Force an enemy troop to retreat"

## Feature 10: Parser — Unique patterns (~50 effects)
- "Blow the Shield Wall" standalone, "Double base spice harvest"
- "+N Persuasion during Reveal turn", "+N Sword for each X"
- "Look at top card", "Turn space into Combat space"
- VP purchase: "Pay N Resource -> +1 VP"
- Endgame: "If you have N+ Resource: +1 VP"

## Feature 11: Combat intrigue — remaining complex effects
- "Recall spy -> +N Swords" combo
- "Deploy from garrison" in combat context
- "If opponent played a Combat Intrigue: +N Swords"

## Feature 12: Intrigue unique mechanics
- Once parser handles more patterns, most will auto-resolve
- Remaining: triggered effects ("When you win a Conflict"), timing modifiers
