# Occupation Cards Implementation - Quick Start Guide

## Getting Started

This guide provides a quick reference for implementing and testing occupation cards. **This guide is optimized for LLM coding agents** with explicit instructions and templates.

For the full plan, see `occupation-cards-implementation-plan.md`.
For prompt templates, see `llm-agent-prompt-template.md`.

## Current Status

- **Total Cards**: 420 across 5 sets (A-E)
- **Current Tests**: 23 (5.5% coverage)
- **Goal**: 100% implementation and testing

## CRITICAL: Testing Requirements

**NEVER consider a card finished if the tests "still need work".**

- All tests MUST pass before marking a card as complete
- If you cannot figure out how to test a card properly, **STOP and ask for assistance**
- Do NOT commit work with failing tests
- Do NOT mark cards as complete if tests are incomplete or failing

## Quick Workflow for LLM Agents

### 1. Choose a Card (or Batch)

**For Single Card:**
- Start with simple cards (Tier 1) to build momentum
- Cards with only `onPlay` hooks
- Cards with simple `modifyCost` hooks
- Cards with basic scoring

**For Batch Processing (Recommended for LLMs):**
- Group 5-10 similar cards together
- Process entire batch using same template
- More efficient for LLM agents

### 2. Check Implementation

**LLM Agent Task:**
```
1. Read: common/agricola/res/cards/{set}/{CardName}.js
2. Extract: card.text field
3. Identify: All hooks mentioned in text
4. Check: Are all hooks implemented?
5. Compare: Does implementation match card text?
```

Look for:
- ✅ Complete implementation with all required hooks
- ❌ Missing hooks or placeholder code
- ❓ Unclear if implementation is correct

**Use codebase_search to find similar cards:**
```
Search for cards with similar hooks or text patterns
Read 2-3 similar implementations as templates
```

### 3. Write/Update Implementation

**LLM Agent Instructions:**
```
1. Load template from similar card
2. Adapt template to current card's requirements
3. Implement all hooks from card text
4. Follow existing code patterns exactly
5. Add comments for any complex logic
```

**Template Pattern:**
- Find similar card with same hook type
- Copy structure, adapt details
- Ensure all hooks are present
- Verify logic matches card text

### 4. Write Tests

Create `CardName.test.js` in the same directory:

```js
const t = require('../../../testutil_v2.js')

describe('Card Name', () => {
  test('primary effect description', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      dennis: {
        hand: ['card-id'],
        // ... setup
      },
    })
    game.run()
    
    // Play the card
    t.choose(game, 'Lessons A')
    t.choose(game, 'Card Name')
    
    // Verify effect
    t.testBoard(game, {
      dennis: {
        occupations: ['card-id'],
        // ... expected state
      },
    })
  })
})
```

### 5. Run Tests

```bash
# Run specific test
npm test -- CardName.test.js

# Run all tests in a directory
npm test -- occupationA
```

## Common Patterns

### Pattern 1: Resource on Play

```js
// Implementation
onPlay(game, player) {
  player.addResource('wood', 1)
  game.log.add({
    template: '{player} gets 1 wood from {card}',
    args: { player, card: this },
  })
}

// Test
test('grants 1 wood when played', () => {
  t.setBoard(game, {
    dennis: { hand: ['card-id'], wood: 0 },
  })
  game.run()
  t.choose(game, 'Lessons A')
  t.choose(game, 'Card Name')
  t.testBoard(game, {
    dennis: {
      occupations: ['card-id'],
      wood: 1,
    },
  })
})
```

### Pattern 2: Action Trigger

```js
// Implementation
onAction(game, player, actionId) {
  if (actionId === 'fishing') {
    player.addResource('food', 1)
    // ...
  }
}

// Test
test('triggers on Fishing action', () => {
  t.setBoard(game, {
    actionSpaces: ['Fishing'],
    dennis: { occupations: ['card-id'], food: 0 },
  })
  game.run()
  t.choose(game, 'Fishing')
  t.testBoard(game, {
    dennis: { food: 1 },
  })
})
```

### Pattern 3: Cost Modification

```js
// Implementation
modifyBuildCost(player, cost, action) {
  if (action === 'build-room') {
    return { ...cost, wood: cost.wood - 1 }
  }
  return cost
}

// Test
test('reduces room cost by 1 wood', () => {
  t.setBoard(game, {
    actionSpaces: ['Farm Expansion'],
    dennis: {
      occupations: ['card-id'],
      wood: 4, // enough for reduced cost
    },
  })
  game.run()
  t.choose(game, 'Farm Expansion')
  t.choose(game, 'Build Room')
  t.choose(game, '0,1')
  t.testBoard(game, {
    dennis: { wood: 1 }, // 4 - 3 = 1
  })
})
```

### Pattern 4: Scoring

```js
// Implementation
getEndGamePoints(player) {
  const count = player.getFieldCount()
  if (count >= 5) return 3
  if (count >= 3) return 2
  return 0
}

// Test
test('scores points based on fields', () => {
  t.setBoard(game, {
    round: 14, // end of game
    dennis: {
      occupations: ['card-id'],
      farmyard: {
        fields: [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
          { row: 0, col: 3 },
          { row: 1, col: 3 },
        ],
      },
    },
  })
  game.run()
  t.testBoard(game, {
    dennis: { score: 3 },
  })
})
```

## Testing Checklist

Before considering a card complete:

- [ ] Implementation has all required hooks
- [ ] At least one test covering primary effect
- [ ] Tests for edge cases (insufficient resources, etc.)
- [ ] Tests pass consistently
- [ ] Code follows existing patterns
- [ ] Comments added for complex logic

## Common Hooks Reference

| Hook | When It Fires | Common Use Cases |
|------|---------------|------------------|
| `onPlay` | When card is played | Grant resources, initialize state |
| `onAction` | When player takes specific action | Modify action effects |
| `onReturnHome` | During return home phase | Offer choices, grant resources |
| `onRoundStart` | At start of each round | Offer actions, grant resources |
| `onFieldPhase` | During field phase of harvest | Grant resources based on fields |
| `modifyCost` | When calculating costs | Reduce building/improvement costs |
| `getEndGamePoints` | During scoring | Award bonus points |
| `modifyRoomCapacity` | When calculating room capacity | Increase room capacity |
| `canUseActionSpace` | When checking action availability | Allow using occupied spaces |

## Resources

- **Full Plan**: `occupation-cards-implementation-plan.md`
- **Testing Spec**: `../specs/testing.md`
- **Test Utilities**: `../../../testutil_v2.js`
- **Example Tests**: See existing `.test.js` files in occupation directories

## Tips for LLM Agents

1. **Batch Processing**: Process 5-10 similar cards together for efficiency
2. **Template Reuse**: Extract templates from existing cards, reuse heavily
3. **Systematic Approach**: Follow the workflow exactly for consistency
4. **Validation**: Always run tests and check linter after each card/batch
5. **Pattern Matching**: Use semantic search to find similar cards
6. **Error Recovery**: When tests fail, analyze systematically and fix root cause
7. **Progress Tracking**: Update audit files as you complete cards

## Batch Processing Strategy

**For LLM agents, batch processing is more efficient:**

1. **Identify Batch**: Find 5-10 cards with same hook type
2. **Load Template**: Use one card as implementation template
3. **Implement All**: Process all cards in batch using template
4. **Create Tests**: Generate tests for all cards in batch
5. **Run Tests**: Test entire batch together
6. **Fix Issues**: Address any failures
7. **Move to Next Batch**: Process next group of similar cards

**Example Batch:**
- Cards: Animal Tamer, Wood Harvester, Clay Puncher (all have `onPlay` resource grants)
- Template: AnimalTamer.js
- Process all 3 together, then test all 3 together

## Next Steps

1. Review the full implementation plan
2. Set up tracking (use tracking template)
3. Choose your first card (start with Tier 1)
4. Follow the workflow above
5. Update tracking as you complete cards

Good luck! 🚀
