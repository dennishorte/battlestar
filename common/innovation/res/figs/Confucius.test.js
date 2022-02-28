Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Confucius', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        yellow: ['Shennong'],
      },
      micah: {
        purple: ['Homer'],
        red: ['Alexander the Great'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Confucius')

    t.testBoard(game, {
      dennis: {
        purple: ['Confucius'],
        yellow: ['Shennong'],
        score: ['Homer'],
      },
      micah: {
        red: ['Alexander the Great'],
      }
    })
  })

  test('karma: biscuit', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Confucius'],
        green: ['The Wheel'],
        red: ['Coal']
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.The Wheel')

    t.testChoices(request2, ['f', 'l'])

  })
})
