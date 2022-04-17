Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Crossword", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Crossword'],
        red: ['Plumbing'],
      },
      decks: {
        base: {
          8: ['Flight'],
        },
        echo: {
          2: ['Scissors'],
        },
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Crossword')
    const request3 = t.choose(game, request2, 8)

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        purple: ['Crossword'],
        red: ['Plumbing'],
        hand: ['Flight', 'Scissors'],
      },
    })
  })
})
