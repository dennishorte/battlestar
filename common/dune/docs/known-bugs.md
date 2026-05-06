# Known Bugs — Dune Imperium: Uprising

Surfaced during the 2026-05 Uprising Imperium card audit. Each entry lists the
symptom, root cause, affected cards/tests, and a suggested fix. Skipped tests
reference this document inline; clearing one of these unblocks several cards at
once.

## Engine / parser bugs

### 1. `parseAgentAbility` infinite recursion on `OR` + nested `If`

- **Symptom**: `RangeError: Maximum call stack size exceeded` when parsing reveal
  text of the form `"+2 Spice OR If 4+ Contracts: Trash this card -> +1 VP"`.
- **Location**: `common/dune/systems/cardEffects.js` (`parseAgentAbility`,
  ~line 281). The OR-split recurses into each branch; the `If`-branch's body
  contains another OR-eligible substring causing unbounded recursion.
- **Cards affected**:
  - `priority-contracts` (both reveal branches skipped)
  - `delivery-agreement` (reveal `+1 Spice OR If 4+ Contracts: Trash → +1 VP`)
- **Fix sketch**: track recursion depth or split-context in `parseAgentAbility`
  so a sub-parse of an `If`-body doesn't re-enter the OR splitter on the same
  span. Alternatively, parse `If`/`OR` as a proper grammar rather than
  successive regex splits.

### 2. Unicode arrow `→` not recognized as cost-effect separator

- **Symptom**: Cards whose printed text uses `→` (U+2192) silently no-op when
  they have no custom `agentEffect`/`revealEffect`. The parser only recognizes
  ASCII `->`, `-->`, and `:`.
- **Location**: `common/dune/systems/cardEffects.js` cost-effect regex
  (search for `-->` / `->` literals).
- **Cards affected**:
  - `captured-mentat` (agent ability)
  - `spy-network` (reveal with 2+ spies on board → intrigue)
  - `shishakli` (agent ability `Trash a card → Draw a card`)
  - Likely several others not yet audited
- **Fix sketch**: add `→` to the splitter alternation. Also audit `tread-in-darkness`,
  `space-time-folding`, and other cards' raw `agentAbility`/`revealAbility`
  text — replace `→` with `->` if normalization is preferred over alternation.

### 3. `+N Spies` (N > 1) parses to nested array

- **Symptom**: `"+2 Spies"` parses to `[[{type:'spy'},{type:'spy'}]]` instead of
  flat `[{type:'spy'},{type:'spy'}]`. The effect dispatcher in
  `playerTurns.js` does not unwrap, so 0 spies are placed.
- **Location**: `common/dune/systems/cardEffects.js` ~line 392 — `parseSingleAbility`
  returns an array for plural `Spies`, then the outer `parseAgentAbility` does
  `effects.push(effect)` without spreading.
- **Cards affected**: `covert-operation` (reveal `+2 Spies`).
- **Fix sketch**: in `parseAgentAbility`, change the push to
  `Array.isArray(effect) ? effects.push(...effect) : effects.push(effect)`.

### 4. `spiesTotal` counter never initialized

- **Symptom**: `has-spies-on-board` condition reads
  `getCounter('spiesTotal') - spiesInSupply`, but `spiesTotal` is never set, so
  the counter defaults to 0 / NaN and the condition is always false.
- **Location**: `common/dune/phases/playerTurns.js:1530` (condition resolution).
  `spiesTotal` should presumably equal each player's starting spy count
  (typically 2 for Uprising).
- **Cards affected**: any reveal/agent text gated on spies-on-board.
  Confirmed: `bene-gesserit-operative` (reveal +2 Persuasion if 2+ spies on board).
- **Fix sketch**: either initialize `spiesTotal` at game setup
  (in `dune.js` setup phase or `DunePlayer` constructor) OR change the
  condition to compute `(player's total spies) - spiesInSupply` from a known
  invariant rather than relying on a never-written counter.

### 5. `faction-card-in-play` does not exclude self

- **Symptom**: `"If you have another <faction> card in play: ..."` triggers when
  the only matching card is the card being played. The played-zone scan does
  not exclude the card whose ability is currently resolving.
- **Location**: `common/dune/phases/playerTurns.js` `resolveCondition`
  (`faction-card-in-play` branch, ~line 1442).
- **Cards affected**: `southern-elders` (the +2 Troops conditional fires
  unconditionally). Likely also `tread-in-darkness`, `hidden-missive`,
  `weirding-woman`, and any other "another <faction> card" text that resolves
  via the generic parser rather than a manual `agentEffect`.
- **Fix sketch**: thread the `card` instance through `resolveCondition` and
  filter `c => c !== card`. Card-author convention should match: when text says
  "another", it means "excluding self".

### 6. Influence-grant ordering: `extraInfluence` set too late

- **Symptom**: Card abilities that say "Gain 2 Influence instead of 1" set the
  `extraInfluence` per-turn flag inside their `agentEffect`. But the engine
  grants the +1 influence at `phases/playerTurns.js:206` *before*
  `resolveCardAgentAbility` runs (line 220), so the flag is set after the
  influence has already been awarded. Subsequent turn placements clear the
  flag, so the +2 path never actually applies.
- **Cards affected**: `overthrow`, `treacherous-maneuver` (the +2 Emperor
  influence path).
- **Fix sketch**: either (a) resolve the card's agent effect before granting
  influence so flags can take effect, or (b) introduce a pre-influence hook
  (`beforeInfluenceGrant`) cards can use to bump the amount, or (c) detect
  these cards earlier and grant 2 directly. (a) is the cleanest but may break
  ordering assumptions in other cards — audit before reorganizing.

### 7. `turnTracking` reset clears acquire flags before they're consumed

- **Symptom**: `price-is-not-object` sets `acquireWithSolari` /
  `acquireToHand` in its `agentEffect`. But `turnTracking` is reset at the
  start of every Agent/Reveal Turn (`phases/playerTurns.js:49`), wiping the
  flags before the Reveal Turn's `acquireCardsPhase` runs.
- **Cards affected**: `price-is-not-object` (both core agent-ability tests
  skipped).
- **Fix sketch**: persist these specific flags across the Agent → Reveal
  transition (e.g. on the player record rather than `turnTracking`), or hold
  off resetting `turnTracking` keys whose semantics span the whole round.

### 8. Chained-If parser drops the "ALSO" linkage

- **Symptom**: Reveal text `"If High Council: +2 Persuasion. If ALSO Swordmaster:
  +1 Persuasion."` is parsed as two independent `If` clauses. The "ALSO"
  modifier (which makes the second clause depend on the first) is ignored, so
  a player with Swordmaster but not High Council still gets the +1.
- **Location**: `common/dune/systems/cardEffects.js` `parseAgentAbility`
  chained-If branch (~line 33, `chainedIfMatch`).
- **Cards affected**: `paracompass` (Swordmaster-only case skipped).
- **Fix sketch**: when an `If ALSO` clause is encountered, AND its condition
  with the previous `If`'s condition rather than treating it as a fresh `If`.

### 9. `ignoreInfluenceRequirements` set after placement check

- **Symptom**: `undercover-asset`'s text says "Ignore Influence requirements
  for one space this turn." The flag is set inside `agentEffect`, which runs
  after `canSendAgentTo` has already evaluated the placement. So the flag
  never helps the placement of the card itself, only subsequent ones.
- **Cards affected**: `undercover-asset` (Sietch Tabr without 2 Fremen
  influence test skipped).
- **Fix sketch**: same family as bug #6 — either resolve the card's effect
  before the placement check, or move the flag to a pre-placement choice
  (e.g. ask the player up-front whether to use the override).

## Card-implementation gaps not yet fixed

These were flagged by the audit but deferred from the bug-fix pass because they
require engine work or a design decision:

### Chani Clever Tactician — duplicate Fremen Bond logic

The card's `revealEffect` manually grants +2 Persuasion for Fremen Bond, but
the generic `resolveCardRevealAbility` already handles `Faction Bond:` text.
The two can't coexist cleanly because the generic resolver short-circuits when
`revealEffect` is defined. Either (a) extract `resolveBond` into a callable
helper that custom `revealEffect`s can invoke, or (b) restructure so the
conditional retreat lives in `revealEffect` while the bond lives only in
`revealAbility` text — which requires the engine to still process bond text
when `revealEffect` returns.

### Treacherous Maneuver — `extraInfluence` ordering

See bug #6. The card was patched to gate on `sentToFactionSpace` but the
underlying ordering means the +2 path is unreachable.

## Test debt

15 currently-skipped tests in
`common/dune/res/cards/imperium/uprising/*.test.js` are blocked on the bugs
above. Re-enabling them is the verification target after each engine fix:

| Card | Test | Blocked on bug |
|------|------|----------------|
| bene-gesserit-operative | reveal with 2+ spies | #4 |
| captured-mentat | agent discard | #2 |
| covert-operation | reveal +2 Spies | #3 |
| delivery-agreement | reveal complex OR | #1 |
| overthrow | agent +2 influence | #6 |
| paracompass | Swordmaster only | #8 |
| price-is-not-object | agent acquires to hand | #7 |
| price-is-not-object | flag clears after one acquire | #7 |
| priority-contracts | reveal <4 contracts | #1 |
| priority-contracts | reveal 4+ contracts | #1 |
| shishakli | agent trash → draw | #2 |
| southern-elders | "another BG" no-op | #5 |
| spy-network | reveal recall → intrigue | #2 |
| treacherous-maneuver | agent +2 influence | #6 |
| undercover-asset | ignore influence req | #9 |
