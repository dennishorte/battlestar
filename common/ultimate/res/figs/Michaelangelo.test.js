Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Michaelangelo', () => {

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Michaelangelo'],
        score: ['Tools', 'Construction'],
        hand: ['Sailing', 'Al-Kindi'],
      },
    })

    game.run()

    t.testBoard(game, {
      dennis: {
        yellow: ['Michaelangelo'],
        score: ['Tools', 'Construction', 'Sailing', 'Al-Kindi'],
        hand: ['Sailing', 'Al-Kindi'],
      },
    })
    expect(t.dennis(game).score()).toBe(7)
  })
})
