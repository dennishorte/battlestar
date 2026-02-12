const t = require('../../../testutil_v2.js')

describe('Piggy Bank', () => {
  test('store 1 food at end of work phase', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['piggy-bank-e027'],
      },
    })
    game.run()

    // Play 4 actions to complete work phase
    t.choose(game, 'Day Laborer')   // dennis: +2 food
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Grain Seeds')   // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Work phase ends → Piggy Bank triggers for dennis
    t.choose(game, 'Store 1 food on Piggy Bank')

    t.testBoard(game, {
      dennis: {
        food: 1,    // 2 (Day Laborer) - 1 (Piggy Bank) = 1
        grain: 1,   // from Grain Seeds
        minorImprovements: ['piggy-bank-e027'],
      },
    })
  })
})
