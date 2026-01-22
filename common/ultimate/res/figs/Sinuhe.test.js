Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sinuhe', () => {
  test('decree karma', () => {
    t.testDecreeForTwo('Sinuhe', 'Rivalry')
  })

  test('score karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Sinuhe'],
        green: {
          cards: ['The Wheel', 'Mapmaking'],
          splay: 'up',
        },
        blue: ['Tools'],
      },
    })
    let request
    request = game.run()
    expect(t.dennis(game).score()).toBe(5)
  })
})
