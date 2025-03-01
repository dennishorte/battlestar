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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chaturanga')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chaturanga')

    t.testIsSecondPlayer(game)
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
