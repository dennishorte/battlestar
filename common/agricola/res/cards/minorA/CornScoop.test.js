const t = require('../../../testutil_v2.js')

describe('Corn Scoop', () => {
  test('gives +1 grain on Grain Seeds action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['corn-scoop-a067'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 1 base + 1 from Corn Scoop
        minorImprovements: ['corn-scoop-a067'],
      },
    })
  })
})
