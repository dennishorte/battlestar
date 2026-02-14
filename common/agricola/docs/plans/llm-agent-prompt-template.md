# LLM Agent Prompt Template for Occupation Card Implementation

## Standard Card Implementation Prompt

Use this template when implementing a single occupation card:

```
You are implementing an Agricola occupation card. Your task is to:

1. Read the card file: {CARD_PATH}
2. Understand the card text: "{CARD_TEXT}"
3. Identify all required hooks based on the card text
4. Find similar card implementations as templates
5. Implement or update the card following existing patterns
6. Create comprehensive tests following the testing spec
7. Verify the implementation works correctly

Card Details:
- Name: {CARD_NAME}
- ID: {CARD_ID}
- Set: {CARD_SET}
- Text: "{CARD_TEXT}"

Requirements:
- Follow the testing spec at: common/agricola/docs/specs/testing.md
- Use integration tests only (no mocks)
- Test through the game engine using t.setBoard, game.run(), t.choose, t.testBoard
- Ensure all hooks mentioned in card text are implemented
- Write at least one test covering the primary functionality
- Test edge cases (insufficient resources, invalid states)

Similar cards to reference:
- {SIMILAR_CARD_1} - {REASON}
- {SIMILAR_CARD_2} - {REASON}

Template implementations:
- Implementation: {TEMPLATE_IMPL_PATH}
- Test: {TEMPLATE_TEST_PATH}

After implementation:
1. Run tests: npm test -- {TEST_PATH}
2. Verify all tests pass
3. Check for linter errors
4. Verify implementation matches card text exactly
```

## Batch Implementation Prompt

Use this template when implementing multiple similar cards:

```
You are implementing a batch of {N} similar Agricola occupation cards.

Batch Details:
- Pattern: {PATTERN_DESCRIPTION}
- Hook Type: {HOOK_TYPE}
- Cards: {CARD_LIST}

Template Card:
- Implementation: {TEMPLATE_CARD_PATH}
- Test: {TEMPLATE_TEST_PATH}
- Pattern: {PATTERN_EXPLANATION}

For each card in the batch:
1. Read the card file
2. Extract card-specific requirements
3. Implement using template as base
4. Adapt to card-specific mechanics
5. Create test file using template
6. Adapt test to card-specific behavior

After implementing all cards:
1. Run all tests: npm test -- {BATCH_PATTERN}
2. Fix any failures
3. Verify each implementation matches its card text
4. Check for linter errors across all files

Cards to implement:
{CARD_DETAILS_LIST}
```

## Card Audit Prompt

Use this to audit existing implementations:

```
Audit all occupation cards in {SET} to determine implementation status.

For each card file in common/agricola/res/cards/{SET}/*.js:
1. Read the implementation
2. Check if all hooks from card text are present
3. Verify implementation correctness
4. Check if test file exists
5. Categorize complexity (simple/medium/complex/interdependent)
6. Note any issues or missing functionality

Output format (JSON):
{
  "card-id": {
    "name": "Card Name",
    "set": "{SET}",
    "hasImplementation": true/false,
    "hooks": ["onPlay", "modifyCost"],
    "hasTests": true/false,
    "complexity": "simple|medium|complex|interdependent",
    "status": "complete|incomplete|missing",
    "issues": ["list", "of", "issues"]
  }
}

Save output to: common/agricola/docs/plans/occupation-cards-audit-{SET}.json
```

## Test Generation Prompt

Use this to generate tests for an existing implementation:

```
Generate comprehensive tests for occupation card: {CARD_NAME}

Card Details:
- Path: {CARD_PATH}
- Text: "{CARD_TEXT}"
- Hooks: {HOOKS_LIST}

Requirements:
1. Follow testing spec: common/agricola/docs/specs/testing.md
2. Use integration tests only (no mocks)
3. Test primary functionality
4. Test edge cases
5. Use existing test files as templates

Template Tests:
- {TEMPLATE_TEST_1} - {REASON}
- {TEMPLATE_TEST_2} - {REASON}

Test File Path: {TEST_PATH}

After creating tests:
1. Run: npm test -- {TEST_PATH}
2. Verify all tests pass
3. Ensure coverage is adequate
```

## Validation Prompt

Use this to validate an implementation:

```
Validate the implementation of occupation card: {CARD_NAME}

Validation Checklist:
1. [ ] Implementation file exists: {CARD_PATH}
2. [ ] All hooks from card text are implemented
3. [ ] Implementation logic matches card text
4. [ ] Test file exists: {TEST_PATH}
5. [ ] Tests cover primary functionality
6. [ ] Tests pass: npm test -- {TEST_PATH}
7. [ ] No linter errors
8. [ ] Code follows existing patterns
9. [ ] Comments added for complex logic

Card Text: "{CARD_TEXT}"
Hooks Required: {REQUIRED_HOOKS}
Hooks Implemented: {IMPLEMENTED_HOOKS}

Report any discrepancies or issues found.
```

## Batch Processing Workflow Prompt

Use this for processing an entire batch:

```
Process batch of {N} {PATTERN_TYPE} occupation cards.

Batch Configuration:
- Category: {CATEGORY}
- Pattern: {PATTERN}
- Template: {TEMPLATE_PATH}
- Test Template: {TEST_TEMPLATE_PATH}

Cards:
{CARD_LIST_WITH_PATHS}

Workflow:
1. For each card:
   a. Read card file and text
   b. Implement using template
   c. Create test using test template
   d. Adapt to card-specific requirements

2. After all cards:
   a. Run all tests: npm test -- {BATCH_PATTERN}
   b. Fix any failures
   c. Validate implementations
   d. Check for linter errors

3. Report:
   - Cards implemented: {N}
   - Tests created: {N}
   - Tests passing: {N}
   - Issues found: {LIST}

Process cards in order, completing each fully before moving to next.
```

## Error Recovery Prompt

Use this when tests fail:

```
Tests are failing for occupation card: {CARD_NAME}

Test Failures:
{FAILURE_OUTPUT}

Current Implementation:
{CURRENT_IMPLEMENTATION}

Test File:
{CURRENT_TEST}

Card Text: "{CARD_TEXT}"

Analyze the failures:
1. Identify root cause
2. Check if implementation matches card text
3. Verify test setup is correct
4. Check for missing hooks or incorrect logic

Fix the issues and:
1. Update implementation if needed
2. Update tests if needed
3. Re-run tests
4. Verify all tests pass
```
