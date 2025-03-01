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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Tractor')

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
