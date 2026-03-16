# Agricola

## Overview

Farm-building worker placement game. Players take turns placing workers on action spaces to collect resources, build rooms, farm crops, raise animals, and feed their families over 14 rounds.

## Key Files

```
common/agricola/
├── agricola.js               Main game class (extends Game)
├── AgricolaActionManager.js  Action handling (extends BaseActionManager)
├── AgricolaPlayer.js         Player state with farm, resources, animals
├── AgricolaLogManager.js     Game-specific log formatting
├── AgricolaPlayerManager.js  Player management
├── AgricolaCard.js           Card definition
├── AgricolaZone.js           Zone extension
├── anytime.js                Anytime action system
├── scheduled.js              Scheduled game events
├── endGame.js                End-game scoring
├── cardManagement.js         Card lifecycle
├── specialAbilities.js       Special ability handlers
├── actionSpaceQueries.js     Action space queries
├── ik.js                     Card database (85KB)
├── actions/                  Action implementations
├── phases/                   Game phase logic
├── player/                   Player feature modules
├── mixins/                   Game mixins
├── util/                     Fencing utilities
├── res/                      Game data (cards, constants)
└── testutil.js               Test helpers
```

## Game Flow

1. `initialize()` - Setup players, zones, action spaces, round cards, improvements
2. `draftPhase()` (optional) - Card drafting
3. `mainLoop()` - 14 rounds, each with phases:
   - **Replenish** - Reveal round actions, reset worker counts
   - **Work** - Players place workers on action spaces (main gameplay)
   - **Return Home** - Workers return, resources collected
   - **Harvest** (rounds 4, 7, 10, 13):
     - Feeding - Feed family members (or take begging cards)
     - Breeding - Animals breed if pairs exist

## Player State (`AgricolaPlayer.js`)

### Resources
`food`, `wood`, `clay`, `stone`, `reed`, `grain`, `vegetables`

### Farmyard
- 3x5 grid for rooms, fields, pastures
- Fences create pastures for animal enclosures
- `housePets` - Animals in rooms
- `virtualFields` - Card-generated fields (e.g., Beanfield)
- `cardAnimals` - Animals on cards (e.g., Feedyard)

### Family
- `familyMembers` (starts at 2, max 5), `availableWorkers`, `newborns`

### Key Methods
- Room: `buildRoom()`, `renovate()` (wood→clay→stone)
- Farm: `canSowAnything()`, `sowVirtualField()`
- Animals: `placeAnimals()`, `getPastureAtSpace()`, `createPasture()`
- Family: `growFamily()`, `resetWorkers()`
- Modifiers: `applyBuildCostModifiers()`, `applyCostModifiers()`, `applyPastureCapacityModifiers()`

## Action Manager (`AgricolaActionManager.js`)

Handles card play, resource collection, and animal placement:
- `choose()` with anytime action support
- `takeAccumulatedResource()` - Collects from accumulating action spaces
- `handleAnimalPlacement()` - Animal overflow/placement modal (v4+)
- `handleBreedingPlacement()` - Breeding with placement constraints
- `getCookingRates()` - Cooking conversion rates

### Action Subdirectories

**`actions/`** (11 files):
- `building.js` - Room building, renovation, cost calculations
- `cards.js` - Major/minor improvement plays, occupations (29KB)
- `farming.js` - Sowing, grain/vegetable placement (19KB)
- `fencing.js` - Fence placement and removal
- `familyGrowth.js` - Family growth actions
- `execute.js` - Action space execution
- `startingPlayer.js` - Starting player determination
- `hooks.js` - Card hooks (onBuildImprovement, onRenovate, etc.)

**`phases/`** (8 files):
- `draft.js`, `replenish.js`, `work.js`, `returnHome.js`, `harvest.js`, `feeding.js`, `breeding.js`

**`player/`** (11 files):
- `animals.js` (36KB) - Animal placement, pastures, breeding
- `pastures.js` (25KB) - Pasture creation, animal capacity
- `sowing.js` (11KB), `cooking.js`, `cards.js` (18KB), `scoring.js`

**`mixins/`**:
- `ActionChoicesMixin.js`, `FarmyardMixin.js`, `HarvestMixin.js`

## Frontend Components (`app/src/modules/games/agricola/`)

24 components for board layout, actions, farmyard, animals, cards, and scoring. Key components include action space modals, animal placement UI, card viewers, and score breakdown.

## Testing

```bash
npm run test -w common -- --testPathPattern agricola
```

- `agricola.test.js` (915 lines) - Main game tests
- `e2e.test.js` - End-to-end tests
- `testutil.js` - Game-specific fixtures: `gameFixture()`, `setPlayerState()`, `fixtureMinorImprovement()`, `fixtureOccupation()`
