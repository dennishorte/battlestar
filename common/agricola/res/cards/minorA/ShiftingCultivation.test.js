const t = require('../../../testutil_v2.js')

describe('Shifting Cultivation', () => {
  test('plows 1 field on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['shifting-cultivation-a002'],
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Shifting Cultivation')
    t.choose(game, '0,2') // plow field at (0,2)

    // passLeft: card moves to micah's hand after being played
    t.testBoard(game, {
      dennis: {
        food: 1, // 2 - 2 (cost) + 1 (Meeting Place)
        hand: [],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
      micah: {
        hand: ['shifting-cultivation-a002'],
      },
    })
  })
})
