Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Daedalus', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Daedalus']
      },
      decks: {
        base: {
          4: ['Perspective'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Daedalus')

    t.testBoard(game, {
      dennis: {
        blue: ['Daedalus'],
        forecast: ['Perspective']
      },
    })
  })

  test('karma: eligibility', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Daedalus'],
        score: ['Software', 'Robotics'],
        forecast: ['Tools', 'A.I.']
      },
      achievements: ['The Wheel', 'Calendar', 'Engineering', 'Enterprise'],
    })

    const request1 = game.run()

    t.testActionChoices(request1, 'Achieve', ['age 1', 'age 2', 'age 3'])
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Daedalus'],
        achievements: ['The Wheel', 'Calendar', 'Enterprise']
      },
    })

    const request1 = game.run()

    expect(game.getScore(t.dennis(game))).toBe(7)
  })
})
