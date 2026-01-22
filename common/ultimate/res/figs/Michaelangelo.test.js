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
    let request
    request = game.run()

    expect(t.cards(game, 'score').sort()).toStrictEqual([
      'Al-Kindi',
      'Construction',
      'Sailing',
      'Tools',
    ])
    expect(t.dennis(game).score()).toBe(7)
  })
})
