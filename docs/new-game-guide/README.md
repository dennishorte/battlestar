# Implementing a New Game

This guide walks through the end-to-end process of adding a new board game to the platform. It covers everything from documenting the rules to wiring up the frontend, following the patterns established by the existing games (Agricola, Twilight Imperium, Innovation: Ultimate, Tyrants of the Underdark, Magic: The Gathering).

## Prerequisites

- Familiarity with the codebase structure (see the root [CLAUDE.md](../../CLAUDE.md))
- Node.js and the npm workspace setup
- A copy of the game's rulebook(s)
- Having played the game (or a strong understanding of its mechanics)

## Table of Contents

| # | Section | Purpose |
|---|---------|---------|
| 1 | [Rules Documentation](01-rules-documentation.md) | Convert the game's rulebook into structured, searchable reference files |
| 2 | [Architecture Planning](02-architecture-planning.md) | Plan the file structure, manager classes, and complexity budget |
| 3 | [Data and Resources](03-data-and-resources.md) | Organize card definitions, game data, and the factory pattern |
| 4 | [Initialization and Game Loop](04-initialization-and-game-loop.md) | Design `_mainProgram()`, phases, rounds, and state management |
| 5 | [Logging Design](05-logging-design.md) | Plan log output first -- it shapes the code structure |
| 6 | [Cards and Abilities](06-cards-and-abilities.md) | Hook systems, triggered abilities, anytime actions |
| 7 | [Testing Strategy](07-testing-strategy.md) | Integration testing philosophy, testutil design, test patterns |
| 8 | [Frontend Integration](08-frontend-integration.md) | Vue components, store, game-specific UI |
| 9 | [Implementation Checklist](09-checklist.md) | Step-by-step checklist with links to each section |

## Suggested Reading Order

1. **Rules first.** You can't implement what you don't understand. Section 1 helps you structure the rules in a way that directly feeds into implementation.
2. **Architecture and data.** Sections 2-3 establish the skeleton: files, managers, card definitions, factory.
3. **Logging before logic.** Section 5 is intentionally placed before you write game logic. Designing the log output reveals the natural function boundaries of your game.
4. **Build iteratively.** Sections 4, 6, and 7 are used in a loop: implement a piece of the game loop, add the card/ability hooks it needs, write tests for it, repeat.
5. **Frontend last.** Section 8 comes after the game engine works end-to-end.
6. **Checklist throughout.** Section 9 tracks progress across all phases.

## Related Documentation

For deeper detail on specific subsystems, refer to these existing docs:

| Topic | Document | When to read |
|-------|----------|-------------|
| Engine architecture | [common/docs/game-engine-overview.md](../../common/docs/game-engine-overview.md) | Understanding deterministic replay, run cycle, GameProxy |
| Base classes | [common/docs/base-classes.md](../../common/docs/base-classes.md) | API reference for BasePlayer, BaseCard, BaseZone, managers |
| Input system | [common/docs/input-request-system.md](../../common/docs/input-request-system.md) | How player input works: selectors, concurrent vs sequential |
| Action-type input | [common/docs/action-type-responses.md](../../common/docs/action-type-responses.md) | Board-click interactions alongside dropdown selection |
| Logging | [common/docs/logging.md](../../common/docs/logging.md) | Full logging guide: templates, arg handlers, frontend pipeline |
| Test infrastructure | [docs/testing.md](../testing.md) | Test frameworks, running tests, shared test helpers |
| API layer | [docs/api.md](../api.md) | Express backend: routes, middleware, MongoDB |
| Frontend | [docs/app.md](../app.md) | Vue 3 app structure, Vuex store, game components |

### Game-Specific References

These show how existing games apply the patterns described in this guide:

| Game | Architecture | Testing | Rules |
|------|-------------|---------|-------|
| Agricola | [docs/games/agricola.md](../games/agricola.md) | [agricola/docs/specs/testing.md](../../common/agricola/docs/specs/testing.md) | [agricola/docs/rules/](../../common/agricola/docs/rules/) |
| Twilight Imperium | [docs/games/twilight.md](../games/twilight.md) | [twilight/docs/specs/testing.md](../../common/twilight/docs/specs/testing.md) | [twilight/docs/living_rules/](../../common/twilight/docs/living_rules/) |
| Innovation: Ultimate | [docs/games/ultimate.md](../games/ultimate.md) | [ultimate/docs/TESTING_CARDS.md](../../common/ultimate/docs/TESTING_CARDS.md) | -- |
| Tyrants | [docs/games/tyrants.md](../games/tyrants.md) | -- | -- |
| Magic | [docs/games/magic.md](../games/magic.md) | -- | -- |
