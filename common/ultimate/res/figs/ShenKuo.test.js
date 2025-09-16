Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shen Kuo', () => {


  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Shen Kuo', 'The Wheel'],
        blue: {
          cards: ['Computers', 'Experimentation'],
          splay: 'left'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'up'
        }
      },
    })

    let request
    request = game.run()

    expect(game.getScore(t.dennis(game))).toBe(6)
  })
})
