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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Crossword')
    request = t.choose(game, request, 8)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Crossword'],
        red: ['Plumbing'],
        hand: ['Flight', 'Scissors'],
      },
    })
  })
})
