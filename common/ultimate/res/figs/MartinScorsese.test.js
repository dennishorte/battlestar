Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Martin Scorsese', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Martin Scorsese'],
      },
      decks: {
        base: {
          10: ['Software']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Martin Scorsese')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Martin Scorsese'],
        blue: ['Software']
      },
    })
  })

  test('karma: meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Martin Scorsese'],
        green: ['The Wheel'],
        hand: ['Fu Xi'],
      },
      achievements: ['Code of Laws', 'Canning', 'Robotics']
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Fu Xi')

    t.testChoices(request2, ['age 1', 'age 6', 'age 10'])

    const request3 = t.choose(game, request2, 'age 6')

    t.testIsSecondPlayer(request3)
    t.setBoard(game, {
      dennis: {
        purple: ['Martin Scorsese'],
        green: ['The Wheel', 'Fu Xi'],
        achievements: ['Canning']
      },
    })
  })
})
