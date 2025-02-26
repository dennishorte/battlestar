Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Benjamin Franklin', () => {

  test('echo and meld karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Navigation'],
        blue: ['Benjamin Franklin'],
      },
      micah: {
        yellow: ['Shennong'],
        purple: ['Enterprise'],
      },
      decks: {
        base: {
          2: ['Fermenting'],
          6: ['Machine Tools']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Benjamin Franklin')

    t.testChoices(request2, ['Benjamin Franklin', 'Shennong'])

    const request3 = t.choose(game, request2, 'Shennong')

    t.testBoard(game, {
      dennis: {
        green: ['Navigation'],
        yellow: ['Shennong', 'Fermenting'],
        blue: ['Benjamin Franklin'],
      },
      micah: {
        purple: ['Enterprise'],
      }
    })

  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Benjamin Franklin', 'Advancement')
  })
})
