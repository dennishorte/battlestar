Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rowland Hill', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 2')
    request = t.choose(game, request, 'Fermenting', 'Canal Building', 'Vaccination')
    request = t.choose(game, request, 'auto')

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
