const t = require('../../../testutil_v2.js')

describe('Bottles', () => {
  test('costs clay + food equal to family members and gives 4 VP', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bottles-b036'],
        clay: 2, food: 2, // cost: 2 clay + 2 food (2 family members)
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bottles')

    t.testBoard(game, {
      dennis: {
        clay: 0, // 2 - 2 (cost)
        food: 1, // 2 - 2 (cost) + 1 (Meeting Place)
        minorImprovements: ['bottles-b036'],
      },
    })
  })
})
