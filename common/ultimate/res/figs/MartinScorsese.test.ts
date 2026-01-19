Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Martin Scorsese', () => {

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

    t.testChoices(request, ['*base-1*', '*base-6*', '*base-10*'])

    request = t.choose(game, request, '**base-6*')

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
