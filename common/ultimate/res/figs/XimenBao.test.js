Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ximen Bao', () => {


  test('karma: decree', () => {
    t.testDecreeForTwo('Ximen Bao', 'Expansion')
  })

  test('karma: when decree', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Ximen Bao', 'Agriculture'],
        hand: ['Homer', 'Shennong'],
      },
      micah: {
        hand: ['Domestication', 'Tools'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Decree.Expansion')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: {
          cards: ['Ximen Bao', 'Agriculture'],
          splay: 'up',
        },
        achievements: ['Expansion'],
      },
      junk: ['Homer', 'Shennong', 'Domestication', 'Tools'],
    })

  })
})
