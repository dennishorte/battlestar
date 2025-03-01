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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Benjamin Franklin')

    t.testChoices(request, ['Benjamin Franklin', 'Shennong'])

    request = t.choose(game, request, 'Shennong')

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
