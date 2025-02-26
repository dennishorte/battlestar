Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Victory achievement', () => {
  test('tucked', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'city'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Reformation'],
        hand: ['Brussels'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2, 'yes')
    const request4 = t.choose(game, request3)

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        purple: ['Reformation', 'Brussels'],
        achievements: ['Victory'],
      }
    })
  })
})
