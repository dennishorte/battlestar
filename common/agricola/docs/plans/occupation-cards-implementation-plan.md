# Occupation Cards Implementation Plan

## Overview

This plan outlines the strategy for implementing and testing all occupation cards across the five occupation sets (A-E) in Agricola. Each set contains 84 cards, for a total of 420 occupation cards.

**This plan is designed for LLM coding agents** and includes explicit instructions, templates, and batch-processing strategies optimized for automated implementation.

**Current Status:**
- occupationA: 84 cards, 3 tests (3.6% coverage)
- occupationB: 84 cards, 3 tests (3.6% coverage)
- occupationC: 84 cards, 5 tests (6.0% coverage)
- occupationD: 84 cards, 9 tests (10.7% coverage)
- occupationE: 84 cards, 3 tests (3.6% coverage)
- **Total: 420 cards, 23 tests (5.5% coverage)**

## Goals

1. **Complete Implementation**: Ensure all 420 occupation cards have working implementations
2. **Comprehensive Testing**: Write integration tests for all cards following the testing spec
3. **Quality Assurance**: Verify each card works correctly through the game engine
4. **Documentation**: Document any complex card interactions or edge cases

## Implementation Strategy

### Phase 1: Assessment and Categorization

**Goal**: Understand what's already implemented and categorize cards by complexity

**LLM Agent Instructions**: Use codebase search and file reading to systematically audit all cards. Generate a structured JSON/CSV report.

#### Tasks:
1. **Audit Existing Implementations** (Automated)
   - **Agent Task**: For each card file, read the implementation
   - **Check**: Does it export a complete module with all required hooks?
   - **Check**: Are there any TODO/FIXME comments or placeholder code?
   - **Output**: Create `occupation-cards-audit.json` with structure:
     ```json
     {
       "card-id": {
         "name": "Card Name",
         "set": "occupationA",
         "hasImplementation": true,
         "hooks": ["onPlay", "modifyCost"],
         "hasTests": false,
         "complexity": "simple|medium|complex|interdependent",
         "status": "complete|incomplete|missing"
       }
     }
     ```

2. **Categorize Cards by Hook Type** (Automated)
   - **Agent Task**: Group cards by primary hook using pattern matching
   - **Output**: Create `occupation-cards-by-hook.json` grouping cards by hook type
   - **Use**: This enables batch processing of similar cards

3. **Identify Common Patterns** (Automated)
   - **Agent Task**: Use semantic search to find cards with similar text patterns
   - **Patterns to identify**:
     - Resource granting cards (onAction, onPlay)
     - Cost modification cards (modifyCost, modifyBuildCost)
     - Scoring cards (getEndGamePoints)
     - Action space modifiers (canUseActionSpace, providesActionSpace)
     - Phase triggers (onRoundStart, onReturnHome, onFieldPhase)
     - Capacity modifiers (modifyRoomCapacity, modifyPastureCapacity)
   - **Output**: Pattern groups for batch implementation

### Phase 2: Implementation Priority

**Goal**: Prioritize cards for implementation based on complexity and dependencies

#### Priority Tiers:

**Tier 1: Simple Cards (Start Here)**
- Cards with only `onPlay` hooks that grant resources
- Cards with simple `modifyCost` hooks
- Cards with basic `getEndGamePoints` scoring
- **Estimated**: ~100-150 cards
- **Examples**: Animal Tamer, Wood Harvester, Stonecutter

**Tier 2: Medium Complexity**
- Cards with `onAction` hooks requiring action space tracking
- Cards with conditional logic (room type, family size, etc.)
- Cards with `onReturnHome` or `onRoundStart` hooks
- **Estimated**: ~150-200 cards
- **Examples**: Grocer, Plow Driver, Curator

**Tier 3: Complex Cards**
- Cards with multiple hooks
- Cards that modify game state significantly
- Cards with unique mechanics or interactions
- **Estimated**: ~70-100 cards
- **Examples**: Freshman, Adoptive Parents, Night-School Student

**Tier 4: Interdependent Cards**
- Cards that interact with other cards
- Cards that require specific game states
- Cards with complex conditional logic
- **Estimated**: ~20-30 cards
- **Examples**: Cards that check for other players' states

### Phase 3: Testing Strategy

**Goal**: Write comprehensive integration tests for all cards

## ⚠️ CRITICAL: Testing Requirements

**NEVER consider a card finished if the tests "still need work".**

- **All tests MUST pass** before marking a card as complete
- **If you cannot figure out how to test a card properly, STOP and ask for assistance**
- **Do NOT commit work with failing tests**
- **Do NOT mark cards as complete if tests are incomplete or failing**
- **Ask for help** rather than leaving tests in a broken state

#### Testing Approach:

1. **Test Template Creation**
   - Create test templates for common hook patterns
   - Document test patterns in `docs/specs/testing.md` (extend existing doc)
   - Establish test naming conventions

2. **Test Coverage Requirements**
   - Each card must have at least one test covering its primary effect
   - Cards with multiple hooks need tests for each hook
   - Edge cases (insufficient resources, invalid states) should be tested
   - Interaction tests for cards that work together
   - **ALL tests must pass before moving to the next card**

3. **Test Organization**
   - One test file per card: `CardName.test.js`
   - Group related test cases using `describe` blocks
   - Use descriptive test names following pattern: `'does X when Y'`

#### Common Test Patterns:

**Pattern 1: onPlay Hook**
```js
test('grants resources when played', () => {
  t.setBoard(game, {
    dennis: { hand: ['card-id'] },
  })
  game.run()
  t.choose(game, 'Lessons A')
  t.choose(game, 'Card Name')
  t.testBoard(game, {
    dennis: {
      occupations: ['card-id'],
      wood: 1, // or whatever resource
    },
  })
})
```

**Pattern 2: onAction Hook**
```js
test('triggers when taking specific action', () => {
  t.setBoard(game, {
    actionSpaces: ['Action Name'],
    dennis: { occupations: ['card-id'] },
  })
  game.run()
  t.choose(game, 'Action Name')
  // ... handle any prompts
  t.testBoard(game, {
    dennis: {
      // verify effect
    },
  })
})
```

**Pattern 3: Cost Modification**
```js
test('reduces cost of building rooms', () => {
  t.setBoard(game, {
    actionSpaces: ['Farm Expansion'],
    dennis: {
      occupations: ['card-id'],
      wood: 5, // enough for reduced cost
    },
  })
  game.run()
  t.choose(game, 'Farm Expansion')
  t.choose(game, 'Build Room')
  t.choose(game, '0,1')
  t.testBoard(game, {
    dennis: {
      wood: 2, // verify reduced cost
    },
  })
})
```

**Pattern 4: Scoring Cards**
```js
test('scores points based on game state', () => {
  t.setBoard(game, {
    round: 14, // end of game
    dennis: {
      occupations: ['card-id'],
      // set up scoring conditions
    },
  })
  game.run()
  t.testBoard(game, {
    dennis: {
      score: 5, // verify scoring
    },
  })
})
```

### Phase 4: Implementation Workflow (LLM Agent Optimized)

**Goal**: Establish a consistent, automatable workflow for implementing and testing cards

#### LLM Agent Workflow Template:

**For each card, execute these steps in order:**

1. **Read Card File**
   ```
   Read: common/agricola/res/cards/{set}/{CardName}.js
   ```

2. **Read Card Text**
   ```
   Extract: card.text field to understand requirements
   Identify: All hooks mentioned or implied in text
   ```

3. **Find Similar Implementations**
   ```
   Search: codebase for cards with similar hooks
   Read: 2-3 example implementations as templates
   ```

4. **Implement Card**
   ```
   If implementation exists:
     - Verify all hooks are present
     - Check for correctness
     - Update if needed
   Else:
     - Create implementation following template pattern
     - Ensure all hooks from card text are implemented
   ```

5. **Create Test File**
   ```
   Read: existing test file as template (e.g., Grocer.test.js)
   Create: {CardName}.test.js following template
   Adapt: Test cases to card's specific mechanics
   ```

6. **Run Tests**
   ```
   Execute: npm test -- {CardName}.test.js
   Verify: All tests pass
   Fix: Any failures before proceeding
   ```

7. **Validate Implementation**
   ```
   Check: Implementation matches card text
   Check: All hooks are properly implemented
   Check: Tests cover primary functionality
   Check: No linter errors
   ```

#### Batch Processing Strategy for LLMs:

**Process cards in batches of 5-10 similar cards:**
1. Group cards by hook type (e.g., all `onPlay` resource grants)
2. Create implementation template for the batch
3. Implement all cards in batch using template
4. Create test template for the batch
5. Write tests for all cards in batch
6. Run all tests together
7. Fix any failures
8. Move to next batch

**Benefits for LLMs:**
- Reduces context switching
- Enables pattern reuse
- Faster iteration
- Easier error detection across similar cards

### Phase 5: Batch Implementation (LLM Agent Strategy)

**Goal**: Implement cards in batches by pattern for maximum LLM efficiency

**LLM Agent Instructions**: Process each batch category completely before moving to next. Use templates heavily.

#### Batch Categories (Process in Order):

1. **Resource Granting Cards** (~50-70 cards)
   - **LLM Task**: Identify all cards with "get X resource" in text
   - **Template**: Use `AnimalTamer.js` or `WoodHarvester.js` as template
   - **Test Template**: Use `Grocer.test.js` as base, adapt for resource type
   - **Batch Size**: Process 10 cards at a time
   - **Validation**: Verify resource is granted correctly in test

2. **Cost Modification Cards** (~30-40 cards)
   - **LLM Task**: Find cards with "costs X less" or "reduces cost" in text
   - **Template**: Use `Stonecutter.js` as template
   - **Test Template**: Test with Farm Expansion (build room) action
   - **Batch Size**: Process 8 cards at a time
   - **Validation**: Verify cost reduction in test (check resource amounts)

3. **Scoring Cards** (~20-30 cards)
   - **LLM Task**: Find cards with "bonus points" or scoring language
   - **Template**: Use `Braggart.js` (in baseA.js) as template
   - **Test Template**: Set `round: 14` in test, verify `score` field
   - **Batch Size**: Process 5 cards at a time (more complex)
   - **Validation**: Verify scoring logic matches card text exactly

4. **Action Space Modifiers** (~30-40 cards)
   - Cards that modify action space behavior
   - Test with various action spaces
   - Verify availability and effects

5. **Phase Trigger Cards** (~40-50 cards)
   - Cards with `onReturnHome`, `onRoundStart`, etc.
   - Test through full rounds
   - Verify timing of effects

6. **Capacity Modifiers** (~10-15 cards)
   - Cards that modify room/pasture capacity
   - Test with various farmyard configurations
   - Verify capacity calculations

7. **Unique Mechanics** (~50-70 cards)
   - Cards with unique or complex mechanics
   - Require individual attention
   - May need custom test approaches

### Phase 6: Quality Assurance

**Goal**: Ensure all cards work correctly in real game scenarios

#### QA Tasks:

1. **Integration Testing**
   - Test cards in multi-player games
   - Verify interactions between cards
   - Test edge cases and error handling

2. **Regression Testing**
   - Run existing tests to ensure no breakage
   - Test cards that interact with implemented cards
   - Verify game flow remains intact

3. **Performance Testing**
   - Ensure card hooks don't cause performance issues
   - Test with many cards in play simultaneously
   - Verify game state updates correctly

4. **Documentation Review**
   - Verify all complex cards are documented
   - Update testing spec with new patterns if needed
   - Document any known limitations or edge cases

## Implementation Tracking

### Progress Metrics

Track progress using:
- **Cards Implemented**: X/420 (X%)
- **Cards Tested**: X/420 (X%)
- **Tests Written**: X total
- **Average Tests per Card**: X

### Status Tracking

For each card, track:
- [ ] Implementation complete
- [ ] Tests written
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Code reviewed

### Weekly Goals

- **Week 1-2**: Complete Phase 1 (Assessment)
- **Week 3-4**: Implement Tier 1 cards (Simple)
- **Week 5-8**: Implement Tier 2 cards (Medium)
- **Week 9-12**: Implement Tier 3 cards (Complex)
- **Week 13-14**: Implement Tier 4 cards (Interdependent)
- **Week 15-16**: QA and final review

## LLM Agent Instructions

### Initial Setup Tasks

1. **Audit All Cards** (One-time, automated)
   ```bash
   # Create audit script
   # For each card file:
   #   - Read implementation
   #   - Extract hooks
   #   - Check for tests
   #   - Categorize complexity
   # Output: occupation-cards-audit.json
   ```

2. **Create Implementation Templates**
   - Extract common patterns from existing cards
   - Create template files for each hook type
   - Store in `docs/templates/` directory

3. **Create Test Templates**
   - Extract test patterns from existing tests
   - Create template files for each test type
   - Store in `docs/templates/` directory

### Per-Card Implementation Prompt Template

```
You are implementing an Agricola occupation card. Follow these steps:

1. Read the card file: {cardPath}
2. Read the card text: "{cardText}"
3. Identify required hooks: {hooks}
4. Find similar implementations: {similarCards}
5. Implement the card following the pattern from {templateCard}
6. Create test file: {testPath}
7. Write tests following pattern from {testTemplate}
8. Run tests: npm test -- {testPath}
9. Fix any failures
10. Verify implementation matches card text exactly
```

### Batch Processing Prompt Template

```
You are implementing a batch of {N} similar occupation cards.

Cards in batch:
{cardList}

All cards share this pattern: {pattern}

Template implementation: {templatePath}
Template test: {testTemplatePath}

For each card:
1. Implement using template
2. Create test using template
3. Adapt to card-specific requirements

After all cards:
1. Run all tests: npm test -- {batchPattern}
2. Fix any failures
3. Verify all implementations are correct
```

## Tools and Resources

### Key Files
- **Testing Spec**: `common/agricola/docs/specs/testing.md`
- **Test Utilities**: `common/agricola/testutil_v2.js`
- **Card Examples**: Existing test files in `occupationA/`, `occupationB/`, etc.
- **Action Manager**: `common/agricola/AgricolaActionManager.js`
- **Player Class**: `common/agricola/AgricolaPlayer.js`

### Useful Commands for LLM Agents

```bash
# Count cards in a set
find common/agricola/res/cards/occupationA -name "*.js" ! -name "*.test.js" ! -name "index.js" | wc -l

# Count tests in a set
find common/agricola/res/cards/occupationA -name "*.test.js" | wc -l

# Find cards without tests
for card in common/agricola/res/cards/occupationA/*.js; do
  test="${card%.js}.test.js"
  if [ ! -f "$test" ] && [[ "$card" != *"index.js" ]]; then
    echo "$(basename $card)"
  fi
done

# Run tests for a specific card
npm test -- occupationA/Grocer.test.js

# Run all occupation tests
npm test -- occupation

# Run tests for a batch
npm test -- occupationA -- --testNamePattern="Card1|Card2|Card3"
```

### LLM Agent Helper Scripts

Create these scripts to automate common tasks:

1. **audit-cards.js**: Generate audit report
2. **find-similar-cards.js**: Find cards with similar patterns
3. **generate-test-template.js**: Generate test from card implementation
4. **validate-implementation.js**: Check if implementation matches card text

## Notes and Considerations

### Common Pitfalls

1. **Don't Mock**: All tests must be integration tests through the game engine
2. **Player Object Staleness**: Always re-obtain player references after `t.choose()` or `t.action()`
3. **Full Rounds**: Some cards trigger in return home phase - need to complete full round
4. **Animal Placement**: Actions giving animals require placement prompts
5. **Card Prereqs**: Use test cards (`test-occupation-1`, etc.) to satisfy prereqs

### Special Considerations

1. **Card Interactions**: Some cards interact with others - test combinations
2. **Player Count**: Some cards only work with 3+ or 4+ players
3. **Round Dependencies**: Some cards only work in certain rounds/stages
4. **State Dependencies**: Some cards require specific game states (stone house, etc.)

### Testing Best Practices

1. **One Test File Per Card**: Makes it easy to find and maintain tests
2. **Descriptive Names**: Test names should clearly describe what they test
3. **Test Edge Cases**: Don't just test the happy path
4. **Verify State**: Always use `t.testBoard` to verify final state
5. **Test Interactions**: When cards interact, test those interactions

## Success Criteria

The implementation is complete when:

1. ✅ All 420 occupation cards have working implementations
2. ✅ All 420 occupation cards have at least one test
3. ✅ All tests pass consistently
4. ✅ Complex cards have multiple tests covering edge cases
5. ✅ Documentation is complete for complex mechanics
6. ✅ Code follows existing patterns and conventions
7. ✅ No regressions in existing functionality

## LLM Agent Execution Plan

### Step 1: Initial Assessment (Automated)
```
1. Read all 420 card files
2. Extract implementation status
3. Generate occupation-cards-audit.json
4. Categorize by hook type
5. Generate occupation-cards-by-hook.json
```

### Step 2: Template Creation (One-time)
```
1. Extract common patterns from existing implementations
2. Create implementation templates for each hook type
3. Extract common patterns from existing tests
4. Create test templates for each test type
5. Store templates in docs/templates/
```

### Step 3: Batch Implementation (Iterative)
```
For each batch category (in priority order):
  1. Identify all cards in category
  2. Load appropriate template
  3. Implement all cards in batch (5-10 at a time)
  4. Create tests for all cards in batch
  5. Run tests
  6. Fix failures
  7. Validate implementations
  8. Move to next batch
```

### Step 4: Validation (Final)
```
1. Run all tests: npm test -- occupation
2. Verify no regressions
3. Check implementation coverage
4. Generate final report
```

## Next Steps for LLM Agents

1. **Execute Initial Assessment**: Run automated audit of all cards
2. **Create Templates**: Extract and document implementation/test templates
3. **Start Batch Processing**: Begin with Tier 1 (Simple) cards
4. **Process in Batches**: Implement 5-10 similar cards at a time
5. **Validate Continuously**: Run tests after each batch
6. **Track Progress**: Update audit.json as cards are completed
