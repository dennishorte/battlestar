Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Chaturanga", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Chaturanga'],
        hand: ['Fermenting'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Chaturanga')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        purple: ['Chaturanga'],
        forecast: ['Calendar'],
      },
    })
  })

  test('dogma: cannot meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Chaturanga'],
      },
      decks: {
        echo: {
          1: ['Plumbing'],
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
        forecast: ['Plumbing'],
      },
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        hand: ['Fermenting'],
        forecast: ['Chaturanga'],
      },
      decks: {
        base: {
          1: ['City States'],
          2: ['Construction'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Fermenting')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Fermenting'],
        purple: ['Chaturanga'],
        forecast: ['City States', 'Construction']
      },
    })
  })
})
