const t = require('../../../testutil.js')

describe('Christianity (C038)', () => {
  test('gives other players 1 food each', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        hand: ['christianity-c038'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 1 } }],
        },
      },
      micah: {
        food: 0,
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'christianity-c038')

    const micah = game.players.byName('micah')
    expect(micah.food).toBe(1)
  })
})
