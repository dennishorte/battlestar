Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rubber", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Rubber'],
      },
      decks: {
        echo: {
          8: ['Tractor', 'Parachute'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Rubber')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Rubber', 'Parachute'],
          splay: 'up'
        },
        score: ['Tractor'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Metalworking'],
        hand: ['Credit Card'],
        forecast: ['Rubber'],
      },
      decks: {
        echo: {
          8: ['Tractor', 'Parachute'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Credit Card')
    request = t.choose(game, request, 'red')
    request = t.choose(game, request, 'Rubber')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Metalworking', 'Parachute'],
          splay: 'up'
        },
        green: ['Credit Card'],
        score: ['Tractor'],
        forecast: ['Rubber'],
      },
    })
  })
})
