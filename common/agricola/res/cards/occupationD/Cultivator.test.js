const t = require('../../../testutil_v2.js')

describe('Cultivator', () => {
  test('onPlowField gives 1 wood and 1 food when plowing via Farmland', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cultivator-d104'],
      },
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '2,0')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 1,
        food: 1,
        occupations: ['cultivator-d104'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
