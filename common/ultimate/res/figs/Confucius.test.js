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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Confucius')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    t.testChoices(request, ['f', 'l'])

  })
})
