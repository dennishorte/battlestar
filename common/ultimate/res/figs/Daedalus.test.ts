Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Daedalus', () => {

  test('karma: eligibility', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: {
          cards: ['Archery', 'Coal'],
          splay: 'left',
        },
        blue: ['Daedalus'],
        score: ['Software', 'Robotics', 'Hypersonics', 'Databases'],
      },
      achievements: ['The Wheel', 'Calendar', 'Engineering', 'Enterprise', 'Societies', 'Canning'],
    })

    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['*base-1*', '*base-2*', '*base-3*', '*base-4*', '*base-5*'])
  })

})
