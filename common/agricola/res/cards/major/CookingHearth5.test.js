const t = require('../../../testutil_v2.js')

describe('Cooking Hearth (cooking-hearth-5)', () => {
  test('upgrade from Fireplace', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        clay: 5,
        majorImprovements: ['fireplace-3'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Cooking Hearth (cooking-hearth-5)')

    t.testBoard(game, {
      dennis: {
        clay: 5, // Upgrade is free (return old card)
        majorImprovements: ['cooking-hearth-5'],
      },
    })
  })
})
