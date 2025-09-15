Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pressure Cooker", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ['Pressure Cooker'],
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise'],
      },
      achievements: ['Mathematics', 'Machinery'],
      decks: {
        echo: {
          2: ['Horseshoes'],
          5: ['Octant'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pressure Cooker')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Pressure Cooker'],
        red: ['Plumbing'],
        hand: ['Horseshoes', 'Octant'],
      },
      standardAchievements: ['Machinery'],
    })
  })

  test('dogma: was foreseen', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Plumbing'],
        hand: ['Sailing', 'Enterprise', 'Astronomy'],
        forecast: ['Pressure Cooker'],
      },
      achievements: ['Mathematics', 'Machinery'],
      decks: {
        echo: {
          2: ['Horseshoes'],
          5: ['Octant'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Astronomy')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        purple: ['Enterprise', 'Astronomy'],
        yellow: ['Pressure Cooker'],
        red: ['Plumbing'],
        hand: ['Horseshoes', 'Octant'],
      },
      standardAchievements: ['Machinery'],
    })
  })
})
