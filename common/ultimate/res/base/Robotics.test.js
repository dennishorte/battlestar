Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Robotics', () => {

  test('dogma', () => {
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
    const request3 = t.choose(game, request2, 'yes')

    t.testIsSecondPlayer(request3)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        green: ['Currency'],
        yellow: ['Stem Cells'],
        score: ['Tools', 'Sailing'],
      },
    })
  })
})
