const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Mud Patch', () => {
  test('gives 1 boar on play via Meeting Place with pasture', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mud-patch-a011'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Mud Patch')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        minorImprovements: ['mud-patch-a011'],
        animals: { boar: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], boar: 1 }],
        },
      },
    })
  })

  test('allows boar on fields', () => {
    const card = res.getCardById('mud-patch-a011')
    expect(card.allowBoarOnFields).toBe(true)
  })
})
