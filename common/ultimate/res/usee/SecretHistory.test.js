Error.stackTraceLimit = 100
const t = require('../../testutil.js')
describe('Secret History', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Secret History'],
        red: {
          cards: ['Coal', 'Industrialization'],
          splay: 'left',
        },
        purple: {
          cards: ['Astronomy', 'Monotheism'],
          splay: 'right',
        },
      },
      micah: {
        safe: ['Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret History')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Secret History'],
        red: {
          cards: ['Coal', 'Industrialization'],
          splay: 'right',
        },
        purple: {
          cards: ['Astronomy', 'Monotheism'],
          splay: 'right',
        },
        safe: ['Metalworking'],
      },
    })
  })

  test('dogma: claim achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'usee'] })
    t.setBoard(game, {
      dennis: {
        green: ['Secret History'],
        red: {
          cards: ['Coal', 'Industrialization'],
          splay: 'right',
        },
        purple: {
          cards: ['Astronomy', 'Monotheism'],
          splay: 'right',
        },
      },
      micah: {
        safe: ['Metalworking'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Secret History')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Secret History'],
        red: {
          cards: ['Coal', 'Industrialization'],
          splay: 'right',
        },
        purple: {
          cards: ['Astronomy', 'Monotheism'],
          splay: 'right',
        },
        safe: ['Metalworking'],
        achievements: ['Mystery'],
      },
    })
  })

})
