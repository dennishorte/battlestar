# Agricola Logging Improvements Plan

Audit of Agricola logging against `common/docs/logging.md` best practices.

## Changes

### 1. Indent action consequences under action header

**File**: `actions/execute.js`

Currently `"{player} takes action: {action}"` is logged at the same level as all consequences (resource gains, card triggers, etc.). Add `indent()` after the action log and `outdent()` at the end of `executeAction()`.

Before:
```
dennis takes action: Forest
dennis gains 3 wood
```

After:
```
dennis takes action: Forest
  dennis gains 3 wood
```

### 2. Log trigger lines for card hooks in the dispatch layer

**File**: `cardManagement.js`

The central hook dispatch (`callPlayerCardHook`, `callPlayerCardHookOrdered`) iterates cards and calls their hooks silently. Individual cards log their own effects, but there's no "trigger" line showing *which card* fired. Adding a trigger line per-card in the dispatch layer means we don't need to modify ~200 individual card files.

Approach: When a hook fires on a card and the card's hook produces log output (indent level changes or new log entries), wrap it with a trigger line. This needs care — not all hooks should show trigger lines (e.g., `onBeforeAction` is a silent setup hook). We'll add trigger logging for player-visible hooks only:
- `onAction`, `afterPlayerAction`, `onHarvest`, `onHarvestStart`, `onHarvestGrain`, `onHarvestVegetables`, `onFieldPhaseEnd`, `onFeedingPhase`, `onFeedingPhaseEnd`, `onBreedingPhaseStart`, `onBreedingPhaseEnd`, `onWorkPhaseStart`, `onBuildFences`, `onBuildRoom`, `onBuildStable`, `onBuildImprovement`, `onGainWood`, `onGainClay`, `onGainStone`, `onGainReed`, `onPlay`

The trigger line format: `"{card} triggers"` with indented consequences below.

However, many card hooks already log `"{player} uses {card} to..."` or `"{player} gets X from {card}"` as their first line. Adding a redundant trigger wrapper would be noisy.

**Revised approach**: Only add trigger context when the hook produces log entries that don't already mention the card name. This is complex to determine generically.

**Simplest approach**: Add indent/outdent in the dispatch layer around each card hook call, so that any logging done by the card is automatically nested under the previous context (the action or phase). Don't add trigger lines — the card's own logging already names itself (e.g., `"{player} gets 1 food from {card}"`). This gives us hierarchy without noise.

Actually, looking at the cards again — they already say `"from {card}"`. The real problem is these messages appear at the same indent level as the action itself. Fix #1 (indenting action consequences) already solves most of this. The card messages will naturally appear indented under the action.

**Verdict**: No changes needed in `cardManagement.js`. Fix #1 handles the hierarchy. Individual cards that do complex multi-step triggered effects (like Ravenous Hunger offering bonus worker placement) can be improved individually as needed.

### 3. Add event types to phase headers

**Files**: `phases/harvest.js`, `phases/feeding.js`, `phases/breeding.js`, `phases/work.js`

Add `event: 'phase-start'` to phase log entries that don't have it, so the frontend can render them distinctly:
- `'Field Phase: Harvesting crops'`
- `'Feeding Phase'`
- `'Breeding Phase'`

### 4. Add `addNoEffect()` for silent hook returns

This is a card-by-card fix. Rather than modifying all ~200 cards at once, we'll skip this for now and address it incrementally as cards are touched.

## Implementation Order

1. **Indent action consequences** (`execute.js`) — biggest visual improvement, single file change
2. **Phase event types** (`harvest.js`, `feeding.js`, `breeding.js`) — small, easy wins
