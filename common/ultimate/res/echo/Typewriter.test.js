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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Typewriter')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Typewriter'],
        hand: ['Canning', 'Telegraph', 'Flight'],
      },
    })
  })
})
