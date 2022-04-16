Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Chaturanga", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Chaturanga'],
        hand: ['Plumbing', 'Tools'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        },
        echo: {
          2: ['Scissors']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chaturanga')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Chaturanga'],
        red: ['Plumbing'],
        hand: ['Tools', 'Calendar', 'Scissors'],
      },
    })
  })

  test('dogma: cannot meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Chaturanga'],
        red: ['Plumbing'],
        hand: ['Tools'],
      },
      decks: {
        echo: {
          2: ['Scissors']
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Chaturanga')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Chaturanga'],
        red: ['Plumbing'],
        hand: ['Tools'],
        forecast: ['Scissors'],
      },
    })
  })
})
