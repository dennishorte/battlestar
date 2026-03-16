# Innovation: Ultimate

## Overview

Civilization-building card game with multiple expansions. Players meld cards, execute dogma effects, draw from age decks, and achieve victories through standard and special achievements.

## Key Files

```
common/ultimate/
├── innovation.js              Main game class (25KB, extends Game)
├── UltimateActionManager.js   Action handling (39KB, extends BaseActionManager)
├── UltimateAgeCard.js         Card ages
├── UltimateAchievement.js     Achievement system
├── UltimateBaseCard.js        Base card class
├── UltimateCardManager.js     Card management
├── UltimatePlayer.js          Player state
├── UltimatePlayerManager.js   Player management
├── UltimateLogManager.js      Game-specific logging
├── UltimateZone.js            Zone with color and splay tracking
├── UltimateZoneManager.js     Zone management
├── UltimateUtils.js           Utility functions
├── testutil.js                Test helpers
├── actions/                   Action implementations
│   ├── Dogma.js               Dogma with sharing/demanding
│   ├── Draw.js                Drawing with expansion/age rules
│   └── Meld.js                Melding with splay updates
├── mixins/
│   ├── ActionChoicesMixin.js  Action choice generation
│   ├── EffectMixin.js         Effect mechanics
│   ├── KarmaMixin.js          Karma triggering and management
│   └── QueryMixin.js          Game state queries
├── res/                       Card data by expansion
│   ├── base/                  Base set
│   ├── echo/                  Echo expansion
│   ├── figs/                  Figures expansion
│   ├── city/                  Cities expansion
│   ├── arti/                  Artifacts expansion
│   └── usee/                  User set
└── docs/                      Documentation
```

## Game Flow

1. `initialize()` - Setup cards, expansions, zones, teams, starting cards
2. `firstPicks()` - Players pick starting card (sorted by name)
3. `mainLoop()` - Turn sequence:
   - Artifact action (free) - dogma or skip
   - Action 1 (always)
   - Action 2 (except first 1-2 turns for first player(s))
   - Achievement checks between actions
   - Figure fading when multiple top cards

## Key Concepts

### Actions
- **Achieve** - Claim achievement from pool (standard or special)
- **Auspice** - Card selection action
- **Decree** - Return hand to deck, execute decree effect
- **Dogma** - Trigger card effects (shared with allies, demanded of opponents)
- **Draw** - Draw from deck by age
- **Endorse** - Place endorsement counter
- **Meld** - Place card in color zone

### Card System
- Cards organized by **age** (1-10) and **expansion**
- Each player has **color zones**: red, blue, green, yellow, purple, artifact
- **Splays**: none, left, right, straight, staircase (affect visible icons)
- Cards have **dogma effects** (demand and/or share) triggered by icon comparison

### Karma System
- Triggers: `would-win`, `decree`, `reduce-special-achievement-requirements`
- Managed by `KarmaMixin`
- Cards can intercept and modify game events

### Achievement System
- **Standard achievements** - Claimed by meeting age + score requirements
- **Special achievements** - Unique conditions per expansion
- Tracked in safe zones and achievement pool

### Expansions
- `base` - Base Innovation set
- `echo` - Echo expansion
- `figs` - Figures (physical tokens that must be "faded")
- `city` - Cities expansion
- `arti` - Artifacts expansion
- `usee` - User-created set

## Frontend Components (`app/src/modules/games/ultimate/`)

24 components for card display (CardFull, CardSquare, CardStacked variants), achievements, and scoring. Includes museum/achievement tracking.

## Testing

```bash
npm run test -w common -- --testPathPattern ultimate
```

- `innovation.test.js` (64KB) - Main game tests
- Per-card tests in `res/{expansion}/*.test.js`
- `testutil.js` - Fixtures: `fixtureFirstPlayer()`, `setBoard()`, `setHand()`, `clearHands()`, `fixtureDecrees()`

### Test Pattern for Cards

```javascript
const t = require('../../testutil.js')

describe('CardName', () => {
  test('effect description', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: { yellow: ['CardName'], hand: ['OtherCard'] },
    })
    let request = game.run()
    request = t.choose(game, 'Dogma.CardName')
    t.choose(game, 'OtherCard')
    expect(game.players.byName('dennis').score()).toBe(2)
  })
})
```
