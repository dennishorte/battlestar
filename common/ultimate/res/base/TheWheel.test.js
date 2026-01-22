Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('The Wheel', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['The Wheel'],
      },
      decks: {
        base: {
          1: ['Tools', 'Sailing'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.The Wheel')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel'],
        hand: ['Tools', 'Sailing']
      },
    })
  })
})
