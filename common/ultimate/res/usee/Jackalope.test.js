Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Jackalope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Jackalope', 'Canning', 'Agriculture'],
        green: {
          cards: ['Metric System', 'Paper', 'The Wheel'],
          splay: 'up',
        },
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'left',
        },
      },
      micah: {
        purple: {
          cards: ['Lighting', 'Monotheism'],
          splay: 'left',
        },
        blue: {
          cards: ['Evolution', 'Atomic Theory', 'Tools'],
          splay: 'right',
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Jackalope')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ['Jackalope', 'Canning', 'Agriculture'],
        green: ['Metric System', 'Paper', 'The Wheel'],
        red: {
          cards: ['Optics', 'Metalworking'],
          splay: 'left',
        },
        blue: ['Evolution']
      },
      micah: {
        purple: {
          cards: ['Lighting', 'Monotheism'],
          splay: 'left',
        },
        blue: ['Atomic Theory', 'Tools'],
      },
    })
  })

})
