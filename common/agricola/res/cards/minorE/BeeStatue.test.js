const t = require('../../../testutil_v2.js')

describe('Bee Statue', () => {
  test('gives top good from stack on Day Laborer', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['bee-statue-e040'],
        clay: 2,   // card cost
        food: 1,   // Meeting Place gives 1 food
      },
    })
    game.run()

    // Play Bee Statue via Meeting Place (initializes stack)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bee Statue')

    t.choose(game, 'Forest')        // micah
    // dennis takes Day Laborer → gets 2 food + top of stack (grain)
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    // Stack was [veg, stone, grain, stone, grain] — top is grain
    t.testBoard(game, {
      dennis: {
        grain: 1,    // 1 from Bee Statue stack (top = grain)
        food: 4,     // 1 + 1 (Meeting Place) + 2 (Day Laborer)
        // clay: 0 (2 - 2 cost)
        minorImprovements: ['bee-statue-e040'],
      },
    })
  })

  test('stack depletes over multiple Day Laborer uses', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['bee-statue-e040'],
        clay: 2,   // card cost
        food: 1,
      },
    })
    game.run()

    // Round 1: Play Bee Statue, then take Day Laborer (pop grain)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bee Statue')
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis → pop grain from stack
    t.choose(game, 'Fishing')       // micah

    // Round 2: Day Laborer again (pop stone)
    t.choose(game, 'Day Laborer')   // dennis → pop stone from stack
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      dennis: {
        grain: 1,   // from stack pop 1 (grain)
        stone: 1,   // from stack pop 2 (stone)
        food: 7,    // 1 + 1 (Meeting Place) + 2 (DL r1) + 2 (DL r2) + 1 (Fishing r2)
        // clay: 0 (2 - 2 cost)
        minorImprovements: ['bee-statue-e040'],
      },
    })
  })
})
