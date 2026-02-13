const t = require('../../../testutil_v2.js')

describe('Ravenous Hunger', () => {
  test('places extra worker on accumulation space after Vegetable Seeds', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Vegetable Seeds'],
      dennis: {
        minorImprovements: ['ravenous-hunger-c042'],
      },
    })
    game.run()

    // dennis: Vegetable Seeds → +1 vegetable → Ravenous Hunger fires
    t.choose(game, 'Vegetable Seeds')
    t.choose(game, 'Use Ravenous Hunger')
    // dennis places bonus worker on Clay Pit (1 clay accumulated)
    t.choose(game, 'Clay Pit')

    // dennis used both workers (1 on Vegetable Seeds, 1 bonus on Clay Pit)
    // micah still has 2 workers
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // micah

    t.testBoard(game, {
      dennis: {
        vegetables: 1,  // from Vegetable Seeds
        clay: 2,         // 1 accumulated + 1 additional from Ravenous Hunger
        minorImprovements: ['ravenous-hunger-c042'],
      },
    })
  })

  test('can skip Ravenous Hunger', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Vegetable Seeds'],
      dennis: {
        minorImprovements: ['ravenous-hunger-c042'],
      },
    })
    game.run()

    t.choose(game, 'Vegetable Seeds')
    t.choose(game, 'Skip')

    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Fishing')       // micah

    t.testBoard(game, {
      dennis: {
        vegetables: 1,
        food: 2,         // Day Laborer
        minorImprovements: ['ravenous-hunger-c042'],
      },
    })
  })
})
