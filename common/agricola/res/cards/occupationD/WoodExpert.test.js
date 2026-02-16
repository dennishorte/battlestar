const t = require('../../../testutil_v2.js')

describe('Wood Expert', () => {
  test('gives 2 wood when played', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['wood-expert-d117'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Wood Expert')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 2,
        occupations: ['wood-expert-d117'],
      },
    })
  })
})
