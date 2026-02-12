const t = require('../../../testutil_v2.js')

describe('Comb and Cutter', () => {
  test('gives food on Day Laborer based on sheep on market', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Sheep Market'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['comb-and-cutter-e059'],
      },
    })
    game.run()

    // Sheep Market has 1 sheep (1 replenishment at round start)
    // Day Laborer gives 2 food + Comb and Cutter gives min(1, 4) = 1 food
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3,
        minorImprovements: ['comb-and-cutter-e059'],
      },
    })
  })
})
