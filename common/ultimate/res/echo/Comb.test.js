Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Comb", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Comb'],
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel', 'Sailing', 'Code of Laws'],
        },
        echo: {
          1: ['Noodles'],
        }
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Comb')
    const request3 = t.choose(game, request2, 'green')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        green: ['Comb'],
        hand: ['The Wheel', 'Sailing'],
      },
    })
  })
})
