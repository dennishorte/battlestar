const t = require('../../../testutil_v2.js')

describe('Hill Cultivator', () => {
  test('gives 2 clay when using Grain Seeds action', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['hill-cultivator-e121'],
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds') // triggers Hill Cultivator → +2 clay

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1, // from Grain Seeds
        clay: 2,  // from Hill Cultivator
        occupations: ['hill-cultivator-e121'],
      },
    })
  })
})
