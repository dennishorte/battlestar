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

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.green')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sargon of Akkad', 'The Wheel'],
        hand: ['Sailing']
      },
    })
  })

})
