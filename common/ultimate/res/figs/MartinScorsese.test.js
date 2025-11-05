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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Martin Scorsese')

    t.testIsSecondPlayer(game)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Fu Xi')

    t.testChoices(request, ['age 1', 'age 6', 'age 10'])

    request = t.choose(game, request, 'age 6')

    t.testIsSecondPlayer(game)
    t.setBoard(game, {
      dennis: {
        purple: ['Martin Scorsese'],
        green: ['The Wheel', 'Fu Xi'],
        achievements: ['Canning']
      },
    })
  })
})
