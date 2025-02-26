Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sargon of Akkad', () => {

  test('inspire and karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sargon of Akkad'],
      },
      decks: {
        base: {
          1: ['The Wheel', 'Sailing']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Sargon of Akkad', 'The Wheel'],
        hand: ['Sailing']
      },
    })
  })

})
