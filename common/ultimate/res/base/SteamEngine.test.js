Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Steam Engine', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Steam Engine', 'Agriculture'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Reformation']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Steam Engine')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Steam Engine'],
        purple: ['Enterprise', 'Reformation'],
        score: ['Agriculture'],
      },
    })
  })
})
