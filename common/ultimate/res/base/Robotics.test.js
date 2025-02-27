Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Robotics', () => {
  test('dogma: no matching biscuit', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Robotics'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          10: ['Miniaturization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Robotics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Miniaturization', 'Robotics'],
      },
    })
  })

  test('dogma: no matching biscuit', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game,  {
      dennis: {
        red: ['Robotics'],
        green: ['Sailing', 'Currency'],
        hand: ['Tools'],
      },
      decks: {
        base: {
          10: ['Stem Cells'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Robotics')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        green: ['Currency'],
        yellow: ['Stem Cells'],
        score: ['Sailing'],
        hand: ['Tools'],
      },
    })
  })
})
