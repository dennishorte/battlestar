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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dice')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Dice')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Dice'],
        hand: ['Tools', 'Ruler'],
      },
    })
  })
})
