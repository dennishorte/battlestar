Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rowland Hill', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rowland Hill'],
      },
      decks: {
        base: {
          7: ['Lighting', 'Bicycle']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Rowland Hill'],
        hand: ['Lighting', 'Bicycle']
      },
    })
  })

  test('karma: achieve', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Rowland Hill'],
        hand: ['Agriculture', 'Fermenting', 'Antibiotics', 'Canal Building', 'Vaccination'],
        score: ['Software'],
      },
      achievements: ['Calendar'],
      decks: {
        figs: {
          1: ['Fu Xi']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Achieve.age 2')
    const request3 = t.choose(game, request2, 'Fermenting', 'Canal Building', 'Vaccination')
    const request4 = t.choose(game, request3, 'auto')

    t.testBoard(game, {
      dennis: {
        yellow: ['Rowland Hill'],
        achievements: ['Agriculture', 'Antibiotics', 'Calendar'],
        score: ['Software'],
      },
      micah: {
        hand: ['Fu Xi']
      }
    })
  })
})
