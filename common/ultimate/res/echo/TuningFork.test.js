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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tuning Fork')
    request = t.choose(game, request, 'base')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'Domestication')
    request = t.choose(game, request, 'yes')

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
