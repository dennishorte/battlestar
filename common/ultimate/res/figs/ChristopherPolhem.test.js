Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Christopher Polhem', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Christopher Polhem', 'Expansion')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Christopher Polhem'],
        red: ['Coal']
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(10)
  })
})
