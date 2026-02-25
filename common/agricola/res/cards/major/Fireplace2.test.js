const t = require('../../../testutil_v2.js')

describe('Fireplace (fireplace-2)', () => {
  test('purchase via Major Improvement action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 2,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        clay: 0,
        majorImprovements: ['fireplace-2'],
      },
    })
  })
})
