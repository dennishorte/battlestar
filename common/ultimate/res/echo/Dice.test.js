Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Dice", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
        },
        echo: {
          1: ['Plumbing'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dice')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Dice'],
        yellow: ['Fermenting'],
        hand: ['Tools', 'Plumbing'],
      },
    })
  })

  test('dogma: no bonus', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools'],
      },
      decks: {
        echo: {
          1: ['Ruler'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Dice')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools', 'Ruler'],
      },
    })
  })
})
