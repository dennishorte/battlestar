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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Comb')
    request = t.choose(game, request, 'green')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Comb'],
        hand: ['The Wheel', 'Sailing'],
      },
    })
  })
})
