const t = require('../../../testutil_v2.js')

describe('Stone Tongs', () => {
  test('gives +1 stone on quarry action', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stone-tongs-a080'],
      },
      actionSpaces: ['Western Quarry'],
    })
    game.run()

    t.choose(game, 'Western Quarry')

    t.testBoard(game, {
      dennis: {
        stone: 2, // 1 accumulated + 1 from Stone Tongs
        minorImprovements: ['stone-tongs-a080'],
      },
    })
  })
})
