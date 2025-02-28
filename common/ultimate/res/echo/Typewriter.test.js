Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Typewriter", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        blue: ['Typewriter'],
        hand: ['Sailing', 'Tools', 'Mathematics', 'Experimentation'],
      },
      decks: {
        base: {
          6: ['Canning'],
          8: ['Flight'],
        },
        echo: {
          7: ['Telegraph'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Typewriter')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Typewriter'],
        hand: ['Canning', 'Telegraph', 'Flight'],
      },
    })
  })
})
