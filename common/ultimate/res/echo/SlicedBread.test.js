Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sliced Bread", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Sliced Bread'],
        hand: ['Tools', 'Canning'],
        score: ['Enterprise'],
      },
      decks: {
        base: {
          3: ['Machinery', 'Engineering'],
          8: ['Flight'],
        },
        echo: {
          8: ['Crossword'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sliced Bread')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Sliced Bread'],
        hand: ['Flight', 'Crossword'],
        score: ['Machinery', 'Engineering'],
      },
    })
  })
})
