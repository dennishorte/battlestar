Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Thermometer", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Sailing', 'Navigation'],
          splay: 'left'
        },
        yellow: ['Fermenting'],
      },
      decks: {
        base: {
          3: ['Machinery'],
          4: ['Gunpowder'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Thermometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        yellow: ['Machinery', 'Fermenting'],
        red: ['Gunpowder'],
      },
    })
  })

  test('dogma: no yellow card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Sailing', 'Navigation'],
          splay: 'left'
        },
      },
      decks: {
        base: {
          1: ['Metalworking']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Thermometer')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Thermometer'],
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        red: ['Metalworking'],
      },
    })
  })
})
