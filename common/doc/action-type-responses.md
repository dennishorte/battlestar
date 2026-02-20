# Action-Type Responses

This document describes the action-type input system, which enables spatial board interactions (clicking on a game board) alongside traditional dropdown selection. For base selector documentation, see [input-request-system.md](./input-request-system.md).

---

## Select vs Action Selector Types

The engine supports two selector types:

| Type | Input Source | Response Format | Validation |
|------|-------------|-----------------|------------|
| `'select'` | Enumerated choices (dropdown) | `selection: ['choice1']` | Checked against choices list |
| `'action'` | Freeform structured data | `selection: { action: 'name', ... }` | Title match only; game validates |

The selector type is determined by `selector.type` or inferred from `selector.choices`:
- `type: 'select'` -- standard enumerated choices
- `type: 'action'` -- freeform input, no choices list
- `choices: '__UNSPECIFIED__'` -- legacy way to indicate action type

---

## The `allowsAction` Property

A selector can be type `'select'` (with enumerated choices) while also accepting action-based responses. This dual-input pattern provides both a dropdown fallback for accessibility and spatial board clicks for normal play.

```javascript
const selector = {
  type: 'select',
  actor: player.name,
  title: 'Choose where to plow a field',
  choices: ['0,1', '1,2', '2,0'],     // Dropdown fallback
  min: 1,
  max: 1,
  allowsAction: 'plow-space',          // Accepts board clicks of this action type
  validSpaces: validSpaces,            // Extra data for the client UI
  help: 'You can also click on the farmyard to select.',
}
```

`allowsAction` can be:
- A string: `'build-room'` -- accepts a single action type
- An array: `['sow-field', 'sow-virtual-field']` -- accepts multiple action types
- `true` -- accepts any action-based response

When `allowsAction` is set:
- The client renders both a dropdown and interactive board elements
- Auto-response is disabled (the engine cannot auto-respond to action-capable selectors)
- The response can be either a standard selection array or an action object

---

## Response Format

### Standard Selection (Dropdown)

When the player uses the dropdown:

```javascript
{
  actor: 'dennis',
  title: 'Choose where to plow a field',
  selection: ['0,1'],
}
```

### Action-Based Response (Board Click)

When the player clicks on the board:

```javascript
{
  actor: 'dennis',
  title: 'Choose where to plow a field',
  selection: { action: 'plow-space', row: 0, col: 1 },
}
```

The `selection` is an object with:
- `action` -- The action name (must match one of the `allowsAction` values)
- Additional data specific to the action type

---

## Handling Dual Input in Game Code

Game code must handle both response formats:

```javascript
const result = this.game.requestInputSingle(selector)

let row, col
if (result.action === 'plow-space') {
  // Action-based response (board click)
  row = result.row
  col = result.col
}
else {
  // Standard selection (dropdown)
  const [r, c] = result[0].split(',')
  row = parseInt(r)
  col = parseInt(c)
}
```

The `BaseActionManager.choose()` method also handles this: when the response has an `action` property, it returns the action object directly instead of an array:

```javascript
const response = this.actions.choose(player, ['Cancel fencing'], {
  title: 'Select spaces for pasture',
  min: 1,
  max: 1,
  allowsAction: 'build-pasture',
  fenceableSpaces,
})

if (response.action === 'build-pasture' && response.spaces) {
  // Handle the pasture building action
}
```

---

## Server-Side Validation

For `'select'` type selectors, the engine validates that each selection exists in the choices list. For `'action'` type selectors (or action-based responses to `allowsAction` selectors), the engine only validates the title match. The game code is responsible for validating the action data.

This means games must validate spatial inputs server-side:

```javascript
if (result.action === 'build-room') {
  const row = result.row
  const col = result.col
  // Validate the space is actually a valid build location
  const valid = validSpaces.find(s => s.row === row && s.col === col)
  if (!valid) {
    throw new Error('Invalid build location')
  }
}
```

---

## Common Action Types (Agricola Examples)

| Action Name | Data Fields | Used For |
|-------------|-------------|----------|
| `build-room` | `{ row, col }` | Placing a room on the farmyard |
| `build-stable` | `{ row, col }` | Placing a stable on the farmyard |
| `plow-space` | `{ row, col }` | Plowing a field space |
| `sow-field` | `{ row, col, cropType }` | Sowing grain or vegetables |
| `sow-virtual-field` | `{ virtualFieldId, cropType }` | Sowing a virtual field (card-created) |
| `build-pasture` | `{ spaces: [{row, col}] }` | Fencing a pasture (multiple spaces) |

---

## The `t.action()` Test Helper

Tests use `t.action()` to simulate action-based responses:

```javascript
/**
 * Respond to an action-type input request.
 * Shorthand for grabbing selectors[0] and calling respondToInputRequest.
 *
 * Usage:
 *   t.action(game, 'build-pasture', { spaces: [{row: 0, col: 1}] })
 *   t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })
 */
TestUtil.action = function(game, actionName, opts = {}) {
  const selector = game.waiting.selectors[0]
  return game.respondToInputRequest({
    actor: selector.actor,
    title: selector.title,
    selection: { action: actionName, ...opts },
  })
}
```

This constructs a properly formatted action response using the waiting selector's actor and title, then submits it through the normal `respondToInputRequest` flow.

### Test Example

```javascript
// Set up a game where the player needs to plow
t.setBoard({
  round: 3,
  actionSpaces: ['take-wood', 'grove', 'plow-1-sow-1'],
})

// Player takes the plow action
t.choose('Plow 1 and/or Sow 1')

// Respond with a board-click action to plow a specific space
t.action(game, 'plow-space', { row: 1, col: 0 })
```

---

## Design Rationale

The dual-input pattern serves two purposes:

1. **Rich UI interaction** -- Players can click directly on the game board (e.g., click a farmyard space to plow it) rather than selecting from a dropdown of coordinates.
2. **Accessibility fallback** -- The same selector always provides enumerated choices as a fallback. Screen readers, keyboard-only users, or simplified clients can use the dropdown instead of spatial interaction.

The game code handles both paths identically after parsing the response, ensuring consistent behavior regardless of input method.
