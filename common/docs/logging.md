# Game Log Best Practices

## Philosophy

The game log serves two purposes simultaneously:

1. **History** — A record of everything that has happened in the game.
2. **Present context** — An explanation of what is happening *right now* and what the game is waiting for.

Every log message should be written with both audiences in mind: a player catching up on what they missed, and a player trying to understand the current game state.

---

## Principles

### 1. The Last Message Tells Everyone What's Happening Now

The most recent log entry should tell all players — including the active player — what the game is currently waiting for. This is the single most important principle.

**Good patterns:**
```
Dennis's Turn                          ← waiting for Dennis to pick an action
Dennis: Tactical Action                ← Dennis picked; now resolving it
  Activate System                      ← within the tactical action
```

**Example:**
```javascript
this.log.add({
  template: "{player}'s Turn",
  args: { player },
  event: 'turn-start',
})
// Game pauses here (InputRequestEvent) — "{player}'s Turn" is the last log entry

// After player responds:
this.log.add({
  template: '{player}: {action}',
  args: { player, action },
  event: 'player-turn',
})
```

### 2. Indentation Shows Hierarchy

Indent marks a message as a sub-action, consequence, or detail of the message above it. The log should read like an outline:

```
Round 3 (Stage 2)
  Round card revealed: Stone Quarry
  Dennis's Turn
    Dennis: Starting Player
  Micah's Turn
    Micah: Grain Seeds
      Micah sows 1 grain
```

**Rules for indentation:**
- Indent after a phase/turn/action header
- Indent for details of a roll, combat round, or complex resolution
- Indent for the results of a triggered effect
- Outdent when the scope ends
- Never leave dangling indentation — always pair `indent()` with `outdent()`

```javascript
this.log.add({ template: 'Space combat in {system}', args: { system }, event: 'combat' })
this.log.indent()
  // ... all combat details logged here ...
this.log.outdent()
```

### 3. Triggered Effects Are Visible

When a game effect triggers in response to another action, log the trigger explicitly, then indent the results beneath it.

**Pattern:**
```
Dennis plays Writ of Execution
  Dennis: choose a card to destroy
  Dennis destroys Micah's Infantry on Mecatol Rex
  Micah's Mech ability triggers                    ← trigger is visible
    Micah deploys 1 Infantry to Mecatol Rex        ← result is indented
```

**Implementation:**
```javascript
// In the trigger handler:
ctx.log.add({
  template: "{player}'s {ability} triggers",
  args: { player, ability: 'Mech ability' },
})
ctx.log.indent()
  // ... effect implementation ...
ctx.log.outdent()
```

The key insight: without the trigger line, players see a unit appear with no explanation. The trigger line is the *explanation*; the indented content is the *consequence*.

### 4. Player Actions Use Active Voice

Log what the player *did*, not what the system did to them.

| Good | Bad |
|------|-----|
| `{player} deploys {card} to {loc}` | `{card} was deployed to {loc}` |
| `{player} chooses not to promote` | `Promotion skipped` |
| `{player} passes` | `Turn passed` |

### 5. Game State Changes Are Explained

Don't just log the mechanical result — include *why* it happened when the cause isn't obvious.

| Good | Bad |
|------|-----|
| `{player} gains 1 trade good (Minister of Commerce)` | `{player} gains 1 trade good` |
| `{player} cannot vote (Galactic Threat)` | (silently skipped) |
| `{player} uses Peace Accords: gains control of {planet}` | `{player} gains {planet}` |

The parenthetical or colon-separated explanation prevents players from being confused about *why* something happened.

### 6. Negative Results Are Logged

When an effect does nothing or a player declines, say so. Silence is ambiguous.

```javascript
this.log.addNoEffect()              // → "no effect"
this.log.addDoNothing(player, 'splay')  // → "{player} chooses not to splay"
```

```
Dennis activates the dogma effects of Calendar
  Micah, Calendar: draw 3 cards
  Dennis, Calendar: no effect                ← explicit, not silent
```

### 7. Phases and Rounds Are Landmarks

Major structural transitions should be clearly marked as navigation landmarks.

```javascript
this.log.add({ template: 'Strategy Phase', event: 'phase-start', args: { phase: 'strategy' } })
this.log.add({ template: '=== Round {round} (Stage {stage}) ===', args: { round, stage }, event: 'round-start' })
```

These landmarks help players scroll through the log and orient themselves. Use `event` fields so the frontend can render them distinctly.

---

## Examples: What Players See

These examples show what the log looks like from the player's perspective. Indentation is rendered visually in the UI.

### Twilight Imperium — Full Round

```
=== Round 1 ===
Strategy Phase
  dennis's Pick
  dennis chooses Leadership
  micah's Pick
  micah chooses Diplomacy
Action Phase
  dennis's Turn
  dennis: Strategic Action
    Leadership
      dennis spends 3 influence to gain 3 command tokens
      micah: Pass
  micah's Turn
  micah: Tactical Action
    Activate System
      micah activates system 26
    Movement
      micah moves 2 fighters from Hacan home to system 26
    Space combat in system 26
      Anti-Fighter Barrage
        dennis scores 1 anti-fighter barrage hit
          Rolls: 8, 5, 3 (need 8+)
        micah assigns 1 hit to fighter
      Round 1
        dennis scores 2 hits
          Rolls: 9, 7 (need 5+)
        micah scores 0 hits
          Rolls: 3 (need 7+)
        micah assigns 2 hits: 1 fighter destroyed
      micah retreats to Hacan home
  dennis's Turn
    dennis: Pass
  micah's Turn
    micah: Pass
Status Phase
  dennis scores Develop Weaponry (1 VP)
  micah scores Expand Borders (1 VP)
```

### Twilight Imperium — Triggered Faction Abilities

```
dennis's Turn
dennis: Tactical Action
  Activate System
    dennis activates Mecatol Rex
  Movement
    dennis moves 2 infantry from Sol home to Mecatol Rex
  Bombardment
    dennis scores 1 bombardment hit
      Rolls: 6 (need 5+)
    micah's Mech Ability triggers
      micah cancels 1 bombardment hit
  Ground Combat
    Round 1
      dennis scores 1 hit
        Rolls: 7 (need 6+)
      micah scores 1 hit
        Rolls: 8 (need 6+)
      dennis assigns hit to infantry
      micah assigns hit to infantry
    micah has no remaining ground forces
    dennis gains control of Mecatol Rex
    Custodians Scored (1 VP)
```

### Innovation: Ultimate — Dogma Chain

```
dennis's turn 5
  First action
  dennis activates the dogma effects of Calendar
    Effects will share with micah.
    micah, Calendar: draw 2 cards for each color where you have the most visible biscuits
      micah draws and melds Telescope
      micah draws Reformation
    dennis, Calendar: draw 2 cards for each color where you have the most visible biscuits
      no effect
    micah draws a sharing bonus
```

### Innovation: Ultimate — Karma Trigger

```
dennis's turn 8
  Second action
  dennis activates the dogma effects of Genetics
    dennis would draw a card, triggering...
      Mendel's Pea Plants: dennis draws a {10} instead
    dennis scores Robotics
    micah, Genetics: no effect
```

### Innovation: Ultimate — Achievement Race

```
micah's turn 12
  First action
  micah activates the dogma effects of Software
    micah draws and scores Computers
    micah draws and melds Bioengineering
    micah draws and tucks Suburbia
    dennis, Software: no effect
  micah achieves World (special achievement)
  micah has 6 achievements — micah wins!
```

### Tyrants of the Underdark — Full Turn

```
dennis turn 3
  dennis plays Noble
  dennis plays Drow Warrior
  dennis plays Priestess of Lolth
  dennis plays Insidious Plan
    dennis may promote a card from discard pile
      dennis promotes House Guard
  dennis recruits Drow Assassin
  dennis deploys troop to Gloomwrought
    dennis gains 2 influence for control of Gloomwrought
  dennis passes
    dennis draws 5 cards
```

### Tyrants of the Underdark — Card Triggers

```
micah turn 5
  micah plays Lolth's Sting
    micah power: Assassinate a Troop
      micah assassinates dennis's troop at Menzoberranzan
      dennis loses control of Menzoberranzan
      micah's Instigator triggers
        micah deploys troop to Menzoberranzan
        micah gains 3 influence for control of Menzoberranzan
  micah plays Drow Warrior
  micah passes
    micah draws 5 cards
```

### Tyrants of the Underdark — Forced Discard Interaction

```
dennis turn 7
  dennis plays Mind Flayer
    All opponents must discard a card
    micah must discard a card
      micah discards Ambassador
      Ambassador's discard trigger activates
        micah may promote Ambassador instead
        micah promotes Ambassador
    scott must discard a card
      scott discards Noble
  dennis passes
    dennis draws 5 cards
```

### Agricola — Worker Placement Round

```
=== Round 4 (Stage 2) ===
  Round card revealed: Clay Pit
  dennis's Turn
    dennis: Day Laborer
      dennis gains 2 food
  micah's Turn
    micah: Forest
      micah gains 3 wood
  dennis's Turn
    dennis: Plow 1 Field
      dennis plows a field
  micah's Turn
    micah: Meeting Place
      micah becomes starting player
      micah plays Pottery
  Harvest
    Field Phase
      dennis harvests 1 grain from field
    Feeding Phase
      dennis feeds family: 4 food required
        dennis pays 4 food
      micah feeds family: 4 food required
        micah pays 2 food
        micah begs for food (2 food short)
    Breeding Phase
      dennis breeds sheep (3 → 4)
```

---

## Technical Implementation

### Templates and Args

Always use `{placeholder}` templates with arg objects — never string concatenation for player-facing content:

```javascript
// Good
this.log.add({
  template: '{player} gains {count} {resource}',
  args: { player, count: 3, resource: 'wood' },
})

// Bad — no arg enrichment, no styling hooks
this.log.add({ template: `${player.name} gains 3 wood` })
```

Arg handlers automatically apply CSS classes (`player-name`, `card-name`, etc.) based on the arg key prefix. Use matching key names:

| Key prefix | Enriched as | CSS class |
|------------|-------------|-----------|
| `player*` | Player name | `player-name` |
| `card*` | Card name/id | `card-id` / `card-name` |
| `zone*` | Zone name | `zone-name` |
| `players` (exact) | Comma-separated names | `player-names` |

Games extend with their own handlers (e.g., `tech*`, `objective*`, `resource*`, `action*`, `loc*`).

### Event Types

The `event` field tells the frontend what *type* of message this is, so it can render it appropriately (e.g., different styling, icons, or layout for a phase header vs. a combat log vs. a memo). It is purely a rendering hint — it does not control game flow or signal waiting state.

| Event | Rendering purpose |
|-------|-------------------|
| `phase-start` | Rendered as a major section header |
| `round-start` | Rendered as a round divider |
| `turn-start` | Rendered as a turn header (player name prominent) |
| `player-turn` | Rendered as an action summary |
| `player-action` | Rendered as a discrete action result |
| `step` | Rendered as a sub-phase label |
| `combat` | Rendered with combat-specific styling |
| `memo` | Rendered as de-emphasized informational text |

### Classes

The `classes` field on log entries provides styling hooks independent of arg enrichment:

```javascript
this.log.add({
  template: "First action",
  classes: ['action-header'],           // Frontend renders as a section header
})

this.log.add({
  template: 'Effects will share with {players}.',
  args: { players: sharingPlayers },
  classes: ['faded-text'],              // De-emphasized secondary info
})
```

### Post-Processing: Combining Messages

`UltimateLogManager` demonstrates combining consecutive related entries:

```javascript
// Instead of two entries:
//   "Dennis draws Software"
//   "Dennis melds Software"
// Automatically combined into:
//   "Dennis draws and melds Software"
```

Implement via `_postEnrichArgs(entry)` — return `true` to suppress the entry and modify the previous one instead.

### Silent Operations

For operations that are implementation details (not meaningful to players), support `{ silent: true }`:

```javascript
if (!opts.silent) {
  this.log.add({
    template: '{player} draws a card',
    args: { player },
  })
}
```

Use sparingly. Most operations *should* be logged.

---

## Common Anti-Patterns

### Missing "why" context
```javascript
// Bad: player sees resources change with no explanation
this.log.add({ template: '{player} gains 2 trade goods', args: { player } })

// Good: source is clear
this.log.add({
  template: '{player} gains 2 trade goods (transaction with {player2})',
  args: { player, player2: seller },
})
```

### Logging implementation details instead of player-meaningful actions
```javascript
// Bad: internal zone mechanics
this.log.add({ template: 'Moving card from hand zone to board zone' })

// Good: what the player did
this.log.add({ template: '{player} melds {card}', args: { player, card } })
```

### Missing negative results
```javascript
// Bad: silence when nothing happens
if (targets.length > 0) {
  // ... do stuff and log it
}
// else: nothing logged, player wonders if the effect was forgotten

// Good: explicit
if (targets.length > 0) {
  // ... do stuff and log it
} else {
  this.log.addNoEffect()
}
```

### Flat log with no structure
```javascript
// Bad: everything at indent level 0
this.log.add({ template: 'Combat begins' })
this.log.add({ template: 'Roll: 7, 3, 9' })
this.log.add({ template: '2 hits scored' })
this.log.add({ template: 'Combat ends' })

// Good: indented hierarchy
this.log.add({ template: 'Space combat in {system}', args: { system }, event: 'combat' })
this.log.indent()
  this.log.add({ template: '{player} scores {hits} hits', args: { player, hits: 2 } })
  this.log.indent()
    this.log.add({ template: 'Rolls: 7, 3, 9 (need 5+)' })
  this.log.outdent()
this.log.outdent()
```

### String concatenation bypassing arg handlers
```javascript
// Bad: no styling, no enrichment
this.log.add({ template: `${player.name} plays ${card.name}` })

// Good: handlers apply CSS classes automatically
this.log.add({ template: '{player} plays {card}', args: { player, card } })
```

---

## Checklist for New Game Logging

- [ ] Every player turn starts with a `turn-start` event log entry
- [ ] Every player action is logged with the player as subject
- [ ] Phase/round transitions are logged with `phase-start` or `round-start` events
- [ ] Triggered effects are logged with an explicit trigger line + indented consequences
- [ ] Declining optional actions logs the refusal
- [ ] Effects with no result log `addNoEffect()` or equivalent
- [ ] Complex resolutions (combat, scoring) use indentation for detail hierarchy
- [ ] All arg keys follow the naming convention for handler enrichment
- [ ] Game-specific entity types have registered arg handlers in a custom LogManager
- [ ] The last log entry at any pause point tells players what the game is waiting for
