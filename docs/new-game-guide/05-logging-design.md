# 5. Logging Design

Design the log output **before** writing game logic. The log structure reveals the natural function boundaries of your game -- each indent level often corresponds to a function scope, and each log entry marks a point where players need to understand what happened.

---

## Start With Example Output

Before writing any code, draft what a full round of your game should look like in the log. This is the single most useful design artifact for the game engine.

Write it as plain text with indentation:

```
=== Round 1 ===
Strategy Phase
  dennis's Pick
  dennis chooses Leadership
  micah's Pick
  micah chooses Diplomacy
Action Phase
  dennis's Turn
  dennis: Tactical Action
    Activate System
      dennis activates system 26
    Movement
      dennis moves 2 fighters from home to system 26
  micah's Turn
  micah: Pass
Status Phase
  dennis scores Develop Weaponry (1 VP)
```

This draft tells you:
- **Phase boundaries** -- where to call `log.add()` with phase-start events
- **Turn structure** -- what the turn-start and player-action log entries look like
- **Indent depth** -- where to call `indent()` and `outdent()`
- **Function boundaries** -- each indent level often maps to a function

---

## Mapping Log Structure to Code Structure

Each indent level in your log output typically corresponds to a function scope:

```
Round 1                         → mainLoop() / roundStart()
  Strategy Phase                → strategyPhase()
    dennis's Pick               → strategyPick(player)
    dennis chooses Leadership
  Action Phase                  → actionPhase()
    dennis's Turn               → playerTurn(player)
    dennis: Tactical Action     → tacticalAction(player)
      Activate System           → activateSystem(player)
        dennis activates ...
```

The indent/outdent pairs mark the entry and exit of each function. This is why designing the log first makes the code structure obvious.

---

## Core Logging Principles

These are summarized from the full [logging guide](../../common/docs/logging.md). Read that document for complete details.

### 1. The Last Message Shows Current State

The most recent log entry should tell all players what the game is waiting for. When the game pauses for input, the last line must make the situation clear:

```javascript
this.log.add({ template: "{player}'s Turn", args: { player }, event: 'turn-start' })
// Game pauses here -- "{player}'s Turn" is the last log entry visible to everyone
```

### 2. Indentation Shows Hierarchy

Indent marks sub-actions, consequences, or details of the message above:

```javascript
this.log.add({ template: '{player}: {action}', args: { player, action }, event: 'player-turn' })
this.log.indent()
  // Details of the action logged here
this.log.outdent()
```

**The indent/outdent contract**: Always pair them in the same function scope. Never indent in a caller and outdent in a callee.

### 3. Triggered Effects Are Visible

When something triggers in response to an action, log the trigger explicitly:

```
dennis plays Insidious Plan
  dennis promotes House Guard
  micah's Spy triggers                    ← trigger is visible
    micah draws 1 card                    ← result is indented
```

### 4. Negative Results Are Logged

Silence is ambiguous. When an effect does nothing, say so:

```javascript
this.log.addNoEffect()                    // "no effect"
this.log.addDoNothing(player, 'splay')    // "{player} chooses not to splay"
```

---

## Custom Arg Handlers

Register handlers in your LogManager subclass for game-specific types that appear in log templates:

```javascript
class MyGameLogManager extends BaseLogManager {
  constructor(game, chat, viewerName) {
    super(game, chat, viewerName)

    this.registerHandler('resource*', (resource) => ({
      value: resource,
      classes: ['resource-name'],
    }))

    this.registerHandler('tech*', (tech) => ({
      value: tech.name,
      classes: ['tech-name'],
    }))

    this.registerHandler('location*', (loc) => ({
      value: loc.name,
      classes: ['location-name'],
    }))
  }
}
```

Handler key patterns:
- **Exact match**: `'resource'` matches only the key `resource`
- **Wildcard prefix**: `'tech*'` matches `tech`, `techCard`, `techResearched`, etc.

**Pass objects, not strings.** Always pass the actual game object to the template args. The handler extracts the display value and attaches CSS classes for frontend rendering. Passing `card.name` instead of `card` bypasses all enrichment.

```javascript
// Good
this.log.add({ template: '{player} researches {tech}', args: { player, tech: techObject } })

// Bad
this.log.add({ template: '{player} researches {tech}', args: { player, tech: techObject.name } })
```

---

## Event Types

The `event` field on log entries is a rendering hint for the frontend:

| Event | Use for |
|-------|---------|
| `round-start` | Round dividers: `=== Round 3 ===` |
| `phase-start` | Phase headers: `Strategy Phase` |
| `turn-start` | Turn headers: `dennis's Turn` |
| `player-turn` | Action summaries: `dennis: Tactical Action` |
| `player-action` | Discrete action results |
| `step` | Sub-phase labels |
| `combat` | Combat-specific styling |
| `memo` | De-emphasized informational text |

---

## The Trigger Logging Convention

For games with card hooks, use the `matches_` convention to gate trigger logging. The dispatch layer logs "{card} triggers for {player}" automatically -- card hooks should not redundantly include the card name:

```javascript
// The dispatch layer logs: "Wall Builder triggers for dennis"
// So the hook just logs the effect:
onAction(game, player, actionId) {
  game.log.add({ template: '{player} gains 2 stone', args: { player } })
}

// Gate with matches_ to suppress the trigger line when irrelevant:
matches_onAction(game, player, actionId) {
  return actionId === 'take-stone'   // Only trigger for stone-taking actions
}
```

See the [trigger logging section](../../common/docs/logging.md#card-hook-trigger-logging-matches-convention) of the logging guide for full details.

---

## Design Checklist

Before writing game logic, verify your log design covers:

- [ ] Round/phase transitions are clearly marked
- [ ] Every player turn starts with a turn-start entry
- [ ] Every player action is logged with the player as subject (active voice)
- [ ] Complex resolutions (combat, scoring) use indentation for detail hierarchy
- [ ] Triggered effects have an explicit trigger line + indented consequences
- [ ] Declining optional actions logs the refusal
- [ ] Effects with no result log "no effect" or equivalent
- [ ] The last log entry at any pause point tells players what the game is waiting for
- [ ] Game-specific entity types have arg handler registrations planned

---

## References

- **Full logging guide**: [common/docs/logging.md](../../common/docs/logging.md)
- **Trigger logging**: [common/docs/logging.md](../../common/docs/logging.md#card-hook-trigger-logging-matches-convention)
