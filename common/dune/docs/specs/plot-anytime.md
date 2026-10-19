# Plot intrigue at any legal time

Plot cards may be played at any moment of your own Agent or Reveal turn. Combat cards stay in the combat round. Endgame cards stay at the end of the game.

Today `offerPlotIntrigue` asks "Play a Plot Intrigue card?" at three stops: before the Agent/Reveal choice, after an Agent turn's effects and before deploy, and after a Reveal turn's acquire and before cleanup. A card drawn in the middle of a turn cannot be played until the next stop. On a Reveal turn that stop is after acquire, so a persuasion card drawn while revealing cannot pay for that acquire.

## Approach

Use the same side channel Agricola uses for anytime actions. Do not add a new "Pass?" prompt on every decision. Do not move the loop into `BaseActionManager`. The base `choose` already returns a selection that has an `action` field before it checks the choice list (`common/lib/game/BaseActionManager.js`). Title matching in `selector.validate` does not run for that selection. The client still sends a title so the response shape matches other answers; the engine accepts the response because of the `action` field.

Rules version **5**. Games already in progress stay on version 4 and keep the three prompts. `factoryFromLobby` uses 5 for new games. The test fixture's default version becomes 5, placed **before** `...options` so a test that passes `version: 2` or `version: 3` still wins.

## When a Plot can be played

On version 5, during phase `player-turns`, while **you** are the player being asked on **your** Agent or Reveal turn:

- Every `choose` you answer can offer your currently legal Plots beside the real decision.
- You may play several before you answer. Each one resolves fully, then the same decision is asked again.
- Plots are not offered on an opponent's prompt. They are not offered in combat, at endgame, during round start, or on another player's turn.

Every version-5 `choose` and every pause receives an explicit `window`. Do not infer the window from an unset flag.

| `window` | Where |
|---|---|
| `start` | The Agent/Reveal choice, and the forced-Reveal pause below. Nowhere else. |
| `turn` | Every later decision on your Agent or Reveal turn, and the draw and deploy pauses. |
| `effect` | A question asked by a Plot that is already resolving. Start-only cards are not offered here. |

`turnTracking` is not cleared at the end of the turn, and `currentTurnPlayer` is still set when combat begins. A pause must require `game.state.phase === 'player-turns'`. Leftover reveal flags do not make a combat reward a Plot window.

Three moments have no decision, and need a one-button pause so the side channel has a request to attach to. The button is "Continue". It is shown only when you hold at least one Plot that is legal in that window. `super.choose` returns `[]` without a request when the choice list is empty, so Continue is a real option, not an empty list.

1. **Before a forced Reveal.** If you have no Agent turn, `playerTurnsPhase` calls `revealTurn` without asking. This pause uses `window: 'start'`.
2. **After you draw an intrigue card** on your Agent or Reveal turn, when no Plot is currently resolving. See the draw-pause rules below.
3. **Before deploy, when deploy would otherwise return without asking.** `deployUnits` returns immediately when the garrison is empty, when `maxDeploy === 0`, and when Shaddam has locked deployment. The first two still need a prompt if a legal Plot exists, including Sardaukar Coordination's `recruitedOnly` call. Shaddam's lock stays a hard return: a Plot does not undo it.

The Honor Guard deployment test plays the card at today's pre-deploy offer, which recruits a troop **before** `deployUnits` runs, so that test never hits the empty-garrison return. Version 5 deletes that offer. The rewritten test plays Honor Guard from the pause, then chooses `Deploy 1 troop(s) from garrison`.

The three `offerPlotIntrigue` calls are removed on version 5. Version 4 keeps them unchanged.

Diversion and Distraction stay as they are: playing one arms a flag, and `deploy.js` checks it. Coercive Negotiation sets `coerciveNegotiation` and nothing reads it. That is a separate bug. This change does not claim to trigger it, and does not fix it.

## Legality

A card appears only when `canPlayPlot(game, player, card, ctx)` is true. `ctx.window` is the window of the prompt being asked.

Declare `plotTiming: 'start' | 'before-agent' | 'any'` on the card (default `'any'`). Do not infer it by parsing `plotText`.

| Cards | Legal when |
|---|---|
| Bindu Suspension, Withdrawn | `window === 'start'` only. |
| Resourceful, Dispatch an Envoy, Infiltrate | `window === 'start'`, and not after an Agent card has been accepted. Their effects set `allIcons`, `allFactionIcons`, and `ignoreOccupancy`, which `canSendAgentTo` already reads. |
| Emperor's Invitation | Same timing as those three. Its effect sets `hasEmperorIcon`, which `canSendAgentTo` does **not** read. Wire that flag into icon matching in this change. Until that read exists, rebuilding the space list does nothing for this card. |
| Everything else with a plot effect | `start` or `turn`. Not `effect` for the card currently resolving. |
| Combat-only and Endgame-only cards | Never on this channel. |

`agentCardPlayed` does not exist today. The agent card is moved to play only after the board space is chosen (`deckEngine.playCard` inside `agentTurn`). Set `turnTracking.agentCardPlayed` when the Agent/Reveal choice **accepts an Agent card**, before `agentTurn`. A Reveal turn is past `before-agent` as soon as `revealTurn` starts (`isRevealTurn` is already set there). An unset `agentCardPlayed` on a Reveal turn is not `start` and is not `before-agent`.

### Paying, and other reasons the effect would do nothing

`offerPlotIntrigue` moves the card to the intrigue discard and then runs the effect. Bribery with fewer than 2 solari is discarded and does nothing. The side channel must not do that.

`canPlayPlot` has to match the effect's real early return, not only a solari check.

- Bribery: at least 2 solari.
- Double Cross: at least 1 solari **and** an opponent with a troop in the Conflict. Solari alone still discards it today.
- Opportunism: at least 2 solari **and** influence in two factions.
- Declarative cards such as Glimpse the Path and Water of Life do not start with a pay effect. The cost sits on a `choice` option, next to a Decline option. The card stays offerable when at least one option can still do something. `resolveEffect`'s `choice` case already drops options the player cannot pay.

Cards whose effect always does something stay offerable. Add `canPlayPlot(game, player)` on each function card that returns early. Do not try to guess those bails from the effect body.

Execution order:

1. Re-check `canPlayPlot`. Refuse if it is now false.
2. Move the card to `common.intrigueDiscard`.
3. Run `plotEffect` / `plotEffects`, logging "{player} plays {card} (Plot)" the way `offerPlotIntrigue` does today.

## Start-of-turn passes

Bindu Suspension sets `turnTracking.binduSuspension`. The "Pass your turn?" question runs in `playerTurnsPhase` after the old start-of-turn offer. Withdrawn sets `turnTracking.passedTurn`, and nothing reads that flag.

Version 5:

- Bindu's effect draws a card, asks "Pass your turn?" itself, and sets `passedTurn` if the answer is yes. That question is `window: 'effect'`, so Bindu and Withdrawn are not offered on it.
- Withdrawn's effect sets `passedTurn` and does not ask. The pass is mandatory.
- The Agent/Reveal `choose` and the forced-Reveal pause pass `allowTurnPass: true`. After a side action, if `passedTurn` is set, that loop returns `{ action: 'turn-passed' }`.
- The caller checks for that sentinel **before** `const [choice] = ...`. An object is not iterable; destructuring it throws. `chooseCards` and `choosePlayer` would also throw. Nested prompts do not pass `allowTurnPass`, so they never return the sentinel. If a nested prompt somehow set `passedTurn`, the outer loop sees the flag on its next iteration and returns the sentinel there.
- `playerTurnsPhase` treats the sentinel like today's Bindu pass: log it and `continue`.

Version 4:

- Bindu's effect only sets `binduSuspension`, as it does now. The phase still asks the question. Do not also ask inside the effect, or version 4 asks twice.
- The same phase block treats `passedTurn` as a skip with no question, so Withdrawn actually passes the turn on version 4 as well.

## Rebuilding the decision

A function passed to `choose` rebuilds the list the player sees. The caller must not keep using the array it built before `choose`. These four decisions re-read live state after `choose` returns.

**Agent or Reveal.** The list function reads the hand and `canSendAgentTo` after each Plot. Resourceful played here adds spaces for the card the player then picks. After `choose` returns, find that card in the hand by id. Do not `playableCards.find` on the array from before the call. If the id is gone, ask again.

**Board space.** The list function recomputes `canSendAgentTo` after each Plot, so a solari or influence Plot can add a space. After `choose` returns, resolve the id against a freshly computed space list. Do not `validSpaces.find` on the pre-call array: a new space is missing there, and `space.id` throws. If the pre-call list is empty and a legal `turn` Plot exists, still open the prompt (Continue, then real spaces once the Plot lands). If the player continues and there is still no space, end the agent turn the way the empty-list return does today. `before-agent` Plots are already illegal here, because `agentCardPlayed` was set when the Agent card was accepted.

**Acquire.** `acquireOneCard` captures `toHand` and `toTopOfDeck` before `chooseCards`, and returns immediately when persuasion is 0. Recruitment Mission sets `acquireToTopOfDeck` during its effect. Played from this prompt, the captured flag would still be false and the card would go to the discard. `chooseCards` also returns a card object; `choose` returns `{ title, id }`, which has no `moveTo`.

On version 5, call `choose` with a function. The function re-reads persuasion, solari, `acquireToHand`, and `acquireToTopOfDeck`, and returns `cardOption`s plus the Pass and Nuke sentinels. `cardOption` already carries the card id, which is why `chooseCards` was used. Do not change `BaseActionManager.chooseCards`. Version 4 keeps `chooseCards`. After the function-form `choose` returns, look the id up in the imperium row or the reserve, and re-read the placement flags at that moment. If persuasion is 0 and a legal Plot exists, still open the prompt. Continuing with nothing affordable ends the step.

**Deploy.** The list function reads the garrison and `maxDeploy` after each Plot. Continue with an empty garrison, and no further Plot, ends the step. After a recruit Plot, the same prompt offers `Deploy 0` through the new maximum. Recompute inside the function; do not keep the counts from before the Plot.

Other prompts (pick a faction, yes/no) may stay as a fixed list.

`chooseCards`, `choosePlayer`, and `chooseYesNo` call `this.choose`. The side action is consumed inside the loop. Those helpers still receive a normal selection. `{ action: 'play-plot' }` and `{ action: 'turn-passed' }` do not leak out to them.

Nested prompts work without extra code, except the `effect` window and `allowTurnPass` rules above. A Plot that asks its own question goes through `DuneActionManager.choose`, so another Plot can be played there. The card just played is already in the discard.

## Choose loop

`DuneActionManager.choose`:

```
while (true) {
  choices = typeof arg === 'function' ? arg() : arg
  if (choices.length === 0) return []          // same as today, no request
  plots = version >= 5 && onYourTurn(actor) ? legalPlots(actor, opts.window) : []
  result = super.choose(actor, choices, {
    ...opts,
    plotActions: plots.length ? plots : undefined,
    noAutoRespond: opts.noAutoRespond || (plots.length > 0) || undefined,
  })
  if (result?.action === 'play-plot') {
    playPlot(result.cardId)                    // depth-counted; see draw pause
    if (opts.allowTurnPass && turnTracking.passedTurn) return { action: 'turn-passed' }
    continue
  }
  return result
}
```

`noAutoRespond` matters when the main list would otherwise auto-pick. `_tryToAutomaticallyRespond` auto-picks when `min >= choices.length` and pushes that answer into `responses`. Holding a Plot must leave that prompt open. A single legal board space is one case. `spies.placeSpy` with a single observation post is another. Version 4 does not set this flag, so games already in progress do not gain a new stored answer.

`play-plot` carries `cardId` of a card in the actor's intrigue zone. Ignore an id that is not currently legal. Do not trust the client for timing or cost.

## Draw pause

`drawIntrigueCard` is also called from combat rewards, leaders, and contracts. Open the pause only when all of these hold:

- `game.state.phase === 'player-turns'`
- it is this player's Agent or Reveal turn
- `playPlot` is not on the stack (`plotPlayDepth === 0`)
- the player now holds a Plot that is legal in `window: 'turn'`

`playPlot` increments the depth before the effect and decrements it after. A Plot that draws another intrigue must not `choose` from inside `drawIntrigueCard` while the effect is still running. When the effect returns, the outer `choose` loop rebuilds `plotActions` on its own. Do not schedule a second pause after the effect. That would ask twice.

## Privacy

Intrigue cards are hidden until played. The waiting selector is produced by every client's replay, and `WaitingPanel` has a tab per player. Plot names must not be rendered for anyone except the actor.

- Attach `plotActions` to the selector for the engine and the acting client.
- The chip strip sits in `DuneGame.vue` directly above `WaitingPanel`. The logged-in player is the `actor` inject. There is no `viewer` on that component. Render the strip only when `actor.name === selector.actor`.
- Opponent tabs and `WaitingChoice` do not list the cards.
- The public log line is the existing "plays {card} (Plot)" line, written when the card is played. Do not log the offered list.
- The response stored in `responses[]` contains the one card played. That is the same information as the public log line.

The strip uses the existing intrigue card chip. Clicking a chip submits:

```
{
  actor,                          // the waiting selector's actor, not "whoever the test last used"
  title: waitingRequest.title,    // sent for shape; not validated on this path
  selection: { action: 'play-plot', cardId }
}
```

## Files

| File | Change |
|---|---|
| `common/dune/DuneActionManager.js` | The loop above. `window` and `allowTurnPass` come from `opts`. |
| `common/dune/phases/playerTurns.js` | Version branch around the three offers. Function-form choices. Callers re-resolve by id from live state. `agentCardPlayed`. Start sentinel handled before destructure. `canPlayPlot` / `playPlot`. Pauses 1 and 3. Version 4 reads `passedTurn`. |
| `common/dune/systems/deckEngine.js` | `drawIntrigueCard` triggers pause 2 under the rules above. |
| `common/dune/phases/playerTurns.js` `canSendAgentTo` | Read `hasEmperorIcon` the same way it reads `allIcons`. |
| `common/dune/dune.js` | `factoryFromLobby` version 5. |
| `common/dune/testutil.js` | Default `version: 5` before `...options`. `t.playPlot(game, cardId or name)` submits the side-channel response for `waiting.selectors[0]`, and uses that selector's actor. |
| Card files listed under Legality | `plotTiming`, and `canPlayPlot` where the effect returns early. |
| `common/dune/res/cards/intrigue/bindu-suspension.js` | Version 5 asks and may set `passedTurn`. Version 4 only sets `binduSuspension`. |
| `common/dune/res/cards/intrigue/withdrawn.js` | Sets `passedTurn`. No question. |
| `app/src/modules/games/dune/components/DuneGame.vue` | Actor-only chip strip above `WaitingPanel`. |
| `common/dune/docs/living_rules/09_agent_turns.md` | One line: the game offers Plots on each of your decisions during the turn, plus after a draw and before deploy. |

## Tests

Run `npm run test -w common -- --testPathPattern dune` after the fixture default moves to 5.

These stored answers will not line up. Fix them from the failures. Do not search-replace `Pass`.

- `t.choose(game, 'Some Plot')` answered "Play a Plot Intrigue card?" at the start, before deploy, or after acquire. The Honor Guard test and the Reinforcements reveal tests are the middle and end offers, not only the start offer. Switch them to `t.playPlot` against the decision that is actually waiting.
- `t.choose(game, 'Pass')` that was declining that offer. A later Pass on acquire, combat, or a card ability stays. Combat's "Play Combat Intrigue card or Pass" stays.
- A test that holds a Plot and reaches a one-choice prompt that used to auto-resolve (one legal space, one spy post). The next scripted answer is now consumed by that prompt.
- A test that draws an intrigue during its own Agent or Reveal turn. The draw pause inserts Continue whenever the drawn card, or a Plot already in hand, is legal. The deck order is seeded, so this fails stably. The next `t.choose` answers Continue or fails validation.

Add these tests:

- A Plot held at the start is absent from the Agent/Reveal choice list and present on `waiting.plotActions`. Playing it does not consume the turn choice.
- Resourceful played from that prompt: the choice function shows the newly legal card, and the caller resolves that card from the hand by id. The following space list includes a green, purple, or yellow space the card could not reach before.
- A persuasion Plot drawn during a reveal effect is playable before acquire. The acquire function includes the card it newly affords. Recruitment Mission played from that prompt puts the acquired card on top of the deck.
- Honor Guard with an empty garrison, played from the before-deploy pause, then `Deploy 1`.
- Bribery with 0 solari is absent from `plotActions`. Double Cross with solari but no enemy troop in the Conflict is absent. The card stays in intrigue.
- Bindu at the start draws a card and can skip the turn. It is absent from a later space choice, and absent from its own pass question. Withdrawn skips with no question.
- An opponent's spy-move prompt does not carry the active player's `plotActions`.
- A combat reward that draws an intrigue does not open a Plot pause.
- A version 4 fixture still offers "Play a Plot Intrigue card?" and does not set `plotActions`. A fixture constructed with `{ version: 3 }` stays on 3.

## Out of scope

- Playing a Plot while an opponent is the one being asked.
- Reordering every automatic line of a board space. The draw pause covers a card drawn mid-resolution. Other in-between moments are the decisions you are already making.
- Combat and Endgame timing.
- Emperor's Invitation's unimplemented "draw a card" mode. Only the icon flag is in the effect today.
- Coercive Negotiation's unread flag.
- Lifting the loop into `common/lib` for Agricola and Dune to share.
