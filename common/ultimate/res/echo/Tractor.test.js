Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Tractor", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Tractor'],
        hand: ['Candles'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Bicycle', 'Evolution']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Tractor')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Tractor'],
        hand: ['Candles', 'Lighting', 'Evolution'],
        score: ['Bicycle'],
      },
    })
  })
})
