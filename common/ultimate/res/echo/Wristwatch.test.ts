Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe("Wristwatch", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Plumbing'],
        yellow: ['Wristwatch'],
        green: ['Credit Card'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
          10: ['Software'],
        },
        echo: {
          9: ['Rock'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Wristwatch')
    request = t.choose(game, request, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Plumbing', 'Coal'],
        yellow: ['Fermenting', 'Wristwatch'],
        green: ['Credit Card'],
        blue: ['Software'],
        purple: ['Rock'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Plumbing'],
        hand: ['Credit Card'],
        forecast: ['Wristwatch'],
      },
      decks: {
        base: {
          9: ['Fission'],
          10: ['Software'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Credit Card')
    request = t.choose(game, request, 'Coal')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Fission', 'Coal'],
        yellow: ['Wristwatch'],
        green: ['Credit Card'],
        blue: ['Software'],
      },
    })
  })
})
