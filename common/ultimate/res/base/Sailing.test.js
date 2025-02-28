Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sailing', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Mysticism']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Sailing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        purple: ['Mysticism'],
      },
    })
  })
})
