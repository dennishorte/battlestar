const t = require('../../../testutil_v2.js')

describe('Millwright', () => {
  test('gives 1 grain when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['millwright-d088'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Millwright')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        grain: 1,
        occupations: ['millwright-d088'],
      },
    })
  })
})
