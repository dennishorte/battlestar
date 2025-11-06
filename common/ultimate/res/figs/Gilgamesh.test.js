Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Gilgamesh', () => {


  test('karma: claim', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Gilgamesh'],
        purple: ['Monotheism'],
      },
      micah: {
        green: ['The Wheel'],
      },
    })

    let request
    request = game.run()

    expect(t.dennis(game).biscuits().k).toBe(8)
    expect(t.dennis(game).biscuits().f).toBe(4)
    expect(game.getScore(t.dennis(game))).toBe(1)
    expect(game.getScore(game.players.byName('micah'))).toBe(-3)
  })

})
