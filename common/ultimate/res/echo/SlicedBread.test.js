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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Sliced Bread')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sliced Bread'],
        hand: ['Flight', 'Crossword'],
        score: ['Machinery', 'Engineering'],
      },
    })
  })
})
