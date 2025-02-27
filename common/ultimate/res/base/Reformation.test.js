Error.stackTraceLimit = 100
const t = require('../../testutil.js')

describe("Reformation", () => {

  test('dogma: choose to splay yellow right', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Reformation'],
        yellow: ['Agriculture', 'Canal Building'],
      },
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2, 'yellow')

    t.testBoard(game, {
      dennis: {
        purple: ['Reformation'],
        yellow: {
          cards: ['Agriculture', 'Canal Building'],
          splay: 'right'
        },
      },
    })
  })

  test('dogma: do not splay any color', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        purple: ['Reformation', 'Mysticism'],
        yellow: ['Agriculture', 'Canal Building'],
      },
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2)

    t.testBoard(game, {
      dennis: {
        purple: ['Reformation', 'Mysticism'],
        yellow: ['Agriculture', 'Canal Building'],
      },
    })
  })

  test('dogma: tuck cards with multiple splayed colors', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        hand: ['Agriculture', 'Metalworking', 'Clothing'],
        purple: ['Reformation'],
        yellow: {
          cards: ['Canal Building', 'Machinery'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
      },
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Reformation')
    const request3 = t.choose(game, request2, 'yes') // Choose to tuck
    const request4 = t.choose(game, request3, 'Agriculture', 'Metalworking') // Tuck two cards
    const request5 = t.choose(game, request4, 'auto')

    t.testBoard(game, {
      dennis: {
        hand: ['Clothing'],
        purple: ['Reformation'],
        yellow: {
          cards: ['Canal Building', 'Machinery', 'Agriculture'],
          splay: 'right'
        },
        red: {
          cards: ['Archery', 'Construction', 'Metalworking'],
          splay: 'left'
        },
      },
    })
  })
})
