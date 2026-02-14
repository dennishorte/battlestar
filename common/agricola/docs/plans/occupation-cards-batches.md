# Occupation Cards Implementation Batches

This file contains small batches (3-5 cards) for LLM agents to work on. **After completing each batch, agents must:**
1. Update the status tracker (`occupation-cards-status.json`)
2. Re-read this file to get the next batch
3. Update progress metrics

This frequent context refresh keeps important details in working memory.

## Batch Status

- **Total Batches**: TBD (will be ~80-140 batches)
- **Completed Batches**: 0
- **Current Batch**: Batch-001

## Batch Queue

### Batch-001: Simple onPlay Resource Grants (Set A)
**Pattern**: Cards that grant a single resource when played  
**Template**: `AnimalTamer.js`  
**Test Template**: `AnimalTamer.test.js` (needs to be created)  
**Complexity**: Simple (Tier 1)

Cards:
1. `animal-tamer-a086` - Animal Tamer (grants wood OR grain choice)
2. `bed-maker-a093` - Bed Maker (grants 1 reed)
3. `wood-carrier-a117` - Wood Carrier (grants wood per improvement)

**LLM Instructions:**
1. Read each card file
2. Verify implementation matches card text
3. Create test file for each card
4. Run tests: `npm test -- occupationA/AnimalTamer.test.js occupationA/BedMaker.test.js occupationA/WoodCarrier.test.js`
5. Update `occupation-cards-status.json` with completion status
6. Move to Batch-002

---

### Batch-002: Simple onPlay Resource Grants (Set A, continued)
**Pattern**: Cards that grant resources when played  
**Template**: `AnimalTamer.js`  
**Test Template**: Use Batch-001 tests as template  
**Complexity**: Simple (Tier 1)

Cards:
1. `firewood-collector-a118` - Firewood Collector
2. `catcher-a114` - Catcher
3. `mushroom-collector-a115` - Mushroom Collector

**LLM Instructions:**
1. Read each card file and verify implementation
2. Create test files following Batch-001 pattern
3. Run tests
4. Update status tracker
5. Move to Batch-003

---

### Batch-003: onPlay + onAction Resource Grants (Set A)
**Pattern**: Cards that grant resources on play AND when taking specific actions  
**Template**: `ClayPuncher.js`  
**Test Template**: Create based on pattern  
**Complexity**: Simple-Medium (Tier 1-2)

Cards:
1. `clay-puncher-a121` - Clay Puncher (onPlay + onAction for Lessons/Clay Pit)
2. `task-artisan-a096` - Task Artisan (onPlay + onStoneActionRevealed)
3. `scythe-worker-a112` - Scythe Worker (onPlay + onHarvest)

**LLM Instructions:**
1. Read each card file
2. Verify both hooks are implemented correctly
3. Create comprehensive tests covering both hooks
4. Run tests
5. Update status tracker
6. Move to Batch-004

---

### Batch-004: Audit and Categorize Set A Cards
**Pattern**: Assessment batch - categorize remaining Set A cards  
**Template**: N/A - this is an audit batch  
**Complexity**: Assessment

**LLM Instructions:**
1. Read ALL remaining occupationA card files (not yet in batches)
2. For each card, determine:
   - Primary hook type (onPlay, onAction, onReturnHome, etc.)
   - Complexity tier (Simple, Medium, Complex, Interdependent)
   - Whether implementation exists and is complete
   - Whether tests exist
3. Create a categorization file: `occupation-cards-setA-categorized.json`
4. Group cards by pattern for future batches
5. Update status tracker with audit results
6. Move to Batch-005 (will be created based on audit results)

---

### Batch-005: Cost Modification Cards (Set A)
**Pattern**: Cards that modify building/improvement costs  
**Template**: `Stonecutter.js` (in baseA.js)  
**Test Template**: Test with Farm Expansion action  
**Complexity**: Medium (Tier 2)

Cards:
1. `stonecutter-a143` - Stonecutter (reduces stone costs by 1)
2. TBD - Find other cost modification cards in Set A
3. TBD

**LLM Instructions:**
1. Read card files
2. Verify modifyCost hooks are implemented
3. Create tests using Farm Expansion (build room) action
4. Verify cost reduction in test assertions
5. Update status tracker
6. Move to Batch-006

---

## Batch Creation Guidelines

When creating new batches:

1. **Keep batches small**: 3-5 cards maximum
2. **Group by pattern**: Cards with similar mechanics
3. **Start simple**: Tier 1 cards first, then Tier 2, etc.
4. **Use templates**: Reference existing implementations
5. **Include instructions**: Clear LLM agent guidance
6. **Require status updates**: Force context refresh after each batch

## Status Update Format

After each batch, update `occupation-cards-status.json`:

```json
{
  "lastUpdated": "2024-01-XX",
  "batchesCompleted": 3,
  "cardsCompleted": 12,
  "cardsTested": 12,
  "currentBatch": "Batch-004",
  "batches": {
    "Batch-001": {
      "status": "completed",
      "cards": ["animal-tamer-a086", "bed-maker-a093", "wood-carrier-a117"],
      "testsCreated": 3,
      "testsPassing": 3,
      "completedDate": "2024-01-XX"
    }
  }
}
```

## Next Steps

1. Complete Batch-001
2. Update status tracker
3. Re-read this file
4. Proceed to Batch-002
5. Continue until all batches complete
