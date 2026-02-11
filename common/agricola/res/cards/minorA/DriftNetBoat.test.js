const t = require('../../../testutil_v2.js')

describe('Drift-Net Boat', () => {
  test('gives +2 food on Fishing action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['drift-net-boat-a051'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')

    t.testBoard(game, {
      dennis: {
        food: 3, // 1 (Fishing) + 2 (Drift-Net Boat)
        minorImprovements: ['drift-net-boat-a051'],
      },
    })
  })
})
