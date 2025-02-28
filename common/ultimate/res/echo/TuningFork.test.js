Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tuning Fork", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        hand: ['Candles', 'Domestication'],
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tuning Fork')
    const request3 = t.choose(game, request2, 'base')
    const request4 = t.choose(game, request3, 1)
    const request5 = t.choose(game, request4, 'Domestication')
    const request6 = t.choose(game, request5, 'yes')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Tuning Fork'],
        green: ['Sailing'],
        blue: ['Tools'],
      },
    })
  })
})
