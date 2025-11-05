Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cai Lun', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Navigation', 'Sailing',],
        yellow: ['Cai Lun', 'Fermenting'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Cai Lun')

    t.testChoices(request, ['green', 'yellow'])

    request = t.choose(game, request, 'green')

    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'left'
        },
        yellow: ['Cai Lun', 'Fermenting'],
      },
    })
  })

  test('karma: achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Cai Lun', 'Fermenting'],
        score: ['Machine Tools'],
      },
      achievements: ['Domestication'],
      decks: {
        base: {
          3: ['Machinery']
        },
        figs: {
          1: ['Homer']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Achieve.age 1')

    t.testBoard(game, {
      dennis: {
        yellow: ['Cai Lun', 'Fermenting'],
        score: ['Machine Tools'],
        forecast: ['Machinery'],
        achievements: ['Domestication'],
      },
      micah: {
        hand: ['Homer']
      }
    })
  })

  test('karma: forecast achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Cai Lun'],
        score: ['Machine Tools'],
        forecast: ['The Wheel'],
      },
      achievements: ['Domestication'],
      decks: {
        base: {
          3: ['Machinery']
        },
        figs: {
          1: ['Homer']
        }
      }
    })

    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['age 1', 'The Wheel'])
  })
})
