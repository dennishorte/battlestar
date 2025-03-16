Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Emmy Noether', () => {


  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Emmy Noether'],
        blue: ['Software'],
        score: ['Calendar'],
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(27)
  })
})
