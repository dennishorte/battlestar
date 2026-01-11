# TypeScript Migration Plan for game-center/common

## Current State

- **Converted:** 1 file (`lib/util.ts`)
- **Remaining:** ~1,476 JavaScript files
- **Branch:** `common-typescript`
- **Infrastructure:** tsconfig.json configured, vitest testing in place, ESLint configured

## Migration Strategy

Convert **bottom-up** starting with core framework classes, then game implementations. This ensures type definitions flow correctly from base classes to implementations.

---

## Phase 1: Core Game Framework (`lib/game/`)

**Priority:** Critical - all game implementations depend on these

| File | Description | Dependencies |
|------|-------------|--------------|
| `BaseCard.js` | Base class for all cards | util.ts |
| `BaseCardManager.js` | Manages card collections | BaseCard |
| `BasePlayer.js` | Base player class | util.ts |
| `BasePlayerManager.js` | Manages players | BasePlayer |
| `Zone.js` | Game zones (hand, deck, etc.) | BaseCard |
| `ZoneManager.js` | Manages zones | Zone |
| `Effect.js` | Game effects system | - |
| `EffectManager.js` | Manages effects | Effect |
| `ActionManager.js` | Handles player actions | - |
| `StateManager.js` | Game state tracking | - |
| `HashManager.js` | State hashing | - |
| `GameFeatures.js` | Feature flags | - |
| `LogManager.js` | Game logging | - |
| `RngManager.js` | Random number generation | util.ts |
| `index.js` | Re-exports all modules | All above |

**Suggested Order:** BaseCard → Zone → BasePlayer → Managers → index.js

---

## Phase 2: Core Library (`lib/`)

| File | Description | Dependencies |
|------|-------------|--------------|
| `game.js` | Main Game class, GameFactory | Phase 1 classes |
| `selector.js` | Card/object selection logic | util.ts |
| `jsonpath.js` | JSON path utilities | - |
| `matchData.js` | Match data structures | - |
| `log.js` | Logging utilities | - |
| `errors.js` | Error classes | - |
| `hashUtil.js` | Hash utilities | - |
| `bots.js` | Bot player logic | Phase 1 classes |
| `transitions.js` | State transitions | - |
| `lookup.js` | Lookup tables | - |

---

## Phase 3: Magic Game (`magic/`)

**Scope:** ~30 files across magic/, magic/draft/, magic/util/

### Core (`magic/`)
- `magic.js` - Main Magic game class
- `Card.js` - Magic card implementation
- `Player.js` - Magic player
- `MagicLog.js` - Magic-specific logging
- Zone files, action handlers, etc.

### Draft System (`magic/draft/`)
- Cube draft functionality
- Draft player/card classes

### Utilities (`magic/util/`)
- Card parsing, mana utilities
- Scryfall integration

---

## Phase 4: Tyrants of the Underdark (`tyrants/`)

**Scope:** ~30 files

- Core game classes
- Card definitions (`tyrants/res/cards/`)
- Resources and game data

---

## Phase 5: Innovation: Ultimate (`ultimate/`)

**Scope:** ~100+ files (largest game)

- Core Innovation classes
- Card implementations
- Achievement system
- Expansion modules

---

## Phase 6: Agricola (`agricola/`)

**Scope:** ~10 files

- Core Agricola classes
- Action spaces
- Resources

---

## Conversion Guidelines

### Type Patterns

```typescript
// For classes extending base classes
class MagicCard extends BaseCard {
  // Add type annotations for all properties
  manaCost: string;
  power: number | null;

  constructor(data: MagicCardData) {
    super(data);
  }
}

// For manager classes
class CardManager<T extends BaseCard> {
  cards: Map<string, T>;
  // ...
}
```

### Export Pattern

Maintain CommonJS compatibility:
```typescript
class MyClass { ... }
module.exports = { MyClass }
```

### Handling Dynamic Properties

For dynamically typed game data, use discriminated unions or index signatures:
```typescript
interface CardEffect {
  type: 'damage' | 'heal' | 'draw';
  value: number;
  target?: string;
}
```

---

## Testing Strategy

1. Convert test files alongside implementation files
2. Run full test suite after each file conversion
3. Use `vitest --watch` during development
4. Ensure no test regressions before moving to next file

```bash
# After each conversion
npm run build
npm test
```

---

## Per-File Checklist

For each file conversion:

- [ ] Read the .js file and understand its purpose
- [ ] Create corresponding .ts file with type annotations
- [ ] Define interfaces for complex data structures
- [ ] Add proper return types to all functions
- [ ] Update imports to use .js extension (for Node resolution)
- [ ] Convert corresponding .test.js to .test.ts
- [ ] Run build and tests
- [ ] Delete original .js file
- [ ] Update any files that import from this module

---

## Estimated Scope

| Phase | Files | Complexity |
|-------|-------|------------|
| Phase 1 | ~15 | High (foundational types) |
| Phase 2 | ~10 | Medium |
| Phase 3 | ~30 | Medium |
| Phase 4 | ~30 | Medium |
| Phase 5 | ~100+ | Medium-High |
| Phase 6 | ~10 | Low |

---

## Risks and Considerations

1. **Circular Dependencies:** Watch for circular imports between base classes
2. **Dynamic Typing:** Some game logic uses dynamic property access - may need careful typing
3. **Test Coverage:** Ensure tests pass throughout to catch type-related regressions
4. **Build Time:** Large codebase may have slower tsc builds - consider incremental compilation
5. **External Consumers:** api and app folders import from common - coordinate changes

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1 with `lib/game/BaseCard.js`
3. Establish type patterns that work well before proceeding to bulk conversion
