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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Reformation')
    request = t.choose(game, request, 'yes')
    request = t.choose(game, request)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Reformation', 'Brussels'],
        achievements: ['Victory'],
      }
    })
  })
})
