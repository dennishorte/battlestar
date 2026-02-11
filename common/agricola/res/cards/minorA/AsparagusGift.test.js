const t = require('../../../testutil_v2.js')

describe('Asparagus Gift', () => {
  test('gives vegetable when fences built >= current round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['asparagus-gift-a068'],
        wood: 4, // 4 fences for a 1-space pasture
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    // Dennis takes Fencing and builds a pasture (4 fences >= round 2)
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 1 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        vegetables: 1, // from Asparagus Gift
        minorImprovements: ['asparagus-gift-a068'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
          pastures: [{ spaces: [{ row: 0, col: 1 }] }],
        },
      },
    })
  })
})
