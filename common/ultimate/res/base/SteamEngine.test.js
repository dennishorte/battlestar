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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Steam Engine')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Steam Engine'],
        purple: ['Enterprise', 'Reformation'],
        score: ['Agriculture'],
      },
    })
  })

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        yellow: ['Steam Engine'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Reformation']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Steam Engine')

    t.testIsSecondPlayer(game)
    t.testDeckIsJunked(game, 6)
    t.testBoard(game, {
      dennis: {
        yellow: [],
        purple: ['Enterprise', 'Reformation'],
        score: ['Steam Engine'],
      },
    })
  })
})
