# 2. Architecture Planning

Before writing code, decide how the game's logic will be organized across files. The key tension: keep files small enough to navigate, but don't fragment so much that control flow becomes hard to follow.

---

## Minimum Viable File Set

Every game needs at least these files:

```
common/<game>/
├── <game>.js                 Main game class, factory, _mainProgram
├── <Game>Player.js           Player class extending BasePlayer
├── <Game>PlayerManager.js    PlayerManager with custom playerClass
├── <Game>LogManager.js       LogManager with custom arg handlers
├── res/
│   └── index.js              Game data aggregator
└── testutil.js               Test utilities extending TestCommon
```

Optional but common additions:

| File | When to add |
|------|-------------|
| `<Game>ActionManager.js` | Custom choice injection, dynamic options, or input validation |
| `<Game>Card.js` | Cards with state beyond what BaseCard provides (counters, attachments, morph) |
| `<Game>CardManager.js` | Custom card lookup or registration logic |
| `<Game>Zone.js` | Custom visibility rules or zone behavior |

---

## File Size Guidelines

| Target | Guideline |
|--------|-----------|
| Main game file | Under ~500 lines. If it's growing past this, extract subsystems. |
| Subsystem files | Under ~600 lines each. Split further if a single mechanic dominates. |
| Player class | Under ~200 lines. Move complex computed properties to helper methods. |
| Manager classes | Under ~100 lines. These should be thin wrappers. |
| Card definitions | One file per card set/type/category. Individual files stay under ~300 lines. |

These aren't hard limits -- Twilight's `factionAbilities.js` is 2,600 lines because the faction system is genuinely that complex. But if your main game file is approaching 1,000 lines, that's a strong signal to extract.

---

## Complexity Tiers

Existing games illustrate four levels of structural complexity:

### Tier 1: Minimal (~1.3K LOC)

*Example: Magic: The Gathering*

- Most logic in the main game file
- Minimal custom managers
- Card state handled by a custom Card class
- Works for games with simple turn structure and complex card objects

### Tier 2: Modular (~3K LOC across ~15 files)

*Example: Agricola*

- Main game file stays small (~450 lines)
- Game logic extracted into directories: `phases/`, `actions/`, `player/`, `mixins/`
- Rich `res/` with card definitions organized by set
- Custom ActionManager for dynamic choice injection
- Best balance of readability and organization for medium-complexity games

### Tier 3: Subsystem Architecture (~5K+ LOC across ~30+ files)

*Example: Twilight Imperium*

- Main game file is large (~2K lines) but organized by phase
- Major mechanics get their own subsystem files: `combat.js`, `factionAbilities.js`, `exploration.js`
- Per-faction handler files in `systems/factions/`
- `model/` directory for internal game model abstractions
- Necessary for games with many interacting subsystems

### Tier 4: Monolithic (Avoid)

*Example: Tyrants (~2.9K LOC in one file)*

- All game logic in a single file
- Works initially but becomes painful to navigate and extend
- If you find yourself here, refactor into Tier 2 or 3

---

## Manager Class Decision Tree

For each manager type, decide whether to extend the base class:

```
Do you need custom arg handlers in the log?
  → Yes: Create <Game>LogManager, register handlers
  → No:  Use BaseLogManager directly

Do you need a custom Player class with game-specific state?
  → Yes: Create <Game>Player and <Game>PlayerManager (to set playerClass)
  → No:  Use BasePlayer and BasePlayerManager

Do you need to inject dynamic choices or modify the choose() flow?
  → Yes: Create <Game>ActionManager
  → No:  Use BaseActionManager

Do your cards have state beyond id/zone/visibility?
  → Yes: Create <Game>Card (and optionally <Game>CardManager)
  → No:  Use BaseCard and BaseCardManager

Do zones need custom visibility rules?
  → Yes: Create <Game>Zone
  → No:  Use BaseZone
```

In practice, almost every game needs at least a custom LogManager (for arg handlers) and Player class (for game-specific state). The others are case-by-case.

---

## Subsystem Extraction

When does a mechanic deserve its own file? When it has:

1. **Its own state** -- data structures that only this mechanic reads/writes
2. **Its own flow** -- multiple steps or phases within the mechanic
3. **Multiple entry points** -- triggered from different places in the game loop
4. **Enough complexity** -- more than ~100 lines of logic

Examples from existing games:

| Subsystem | Game | File | Why extracted |
|-----------|------|------|---------------|
| Combat | Twilight | `systems/combat.js` (1,079L) | Multi-round resolution with AFB, bombardment, retreats |
| Faction abilities | Twilight | `systems/factionAbilities.js` (2,601L) | 26 factions with unique handlers |
| Card management | Agricola | `cardManagement.js` | Hook dispatch, trigger logging, card lifecycle |
| Anytime actions | Agricola | `anytime.js` | Conversions, exchanges, triggered outside normal flow |
| End-game scoring | Agricola | `endGame.js` | Complex scoring with multiple categories |
| Scheduled events | Agricola | `scheduled.js` | Future-round resource delivery |

---

## Directory Layout Conventions

Organize subdirectories by purpose:

```
common/<game>/
├── phases/          Phase logic (one file per major phase)
├── systems/         Subsystem mechanics (combat, trading, diplomacy)
├── actions/         Action implementations (one file per action type or group)
├── player/          Player-specific method modules
├── mixins/          Shared behavior mixed into the game class
├── model/           Internal model abstractions (Galaxy, Board, etc.)
├── res/             Game data
│   ├── index.js     Aggregator
│   ├── cards/       Card definitions by set/type
│   └── ...          Other data (maps, tiles, constants)
├── docs/            Game-specific documentation
│   ├── living_rules/ or rules/
│   └── specs/       Implementation specs (testing guide, etc.)
└── tests/           Test files
```

Not every game needs all of these. Start with the minimum and add directories as complexity demands.

---

## References

- **Base classes API**: [common/docs/base-classes.md](../../common/docs/base-classes.md)
- **Engine overview**: [common/docs/game-engine-overview.md](../../common/docs/game-engine-overview.md)
- **Game architecture summaries**: [docs/games/](../games/) (one file per game)
