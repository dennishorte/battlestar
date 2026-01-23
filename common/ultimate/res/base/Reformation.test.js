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
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Reformation')
    request = t.choose(game, 'yellow')

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
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Reformation')
    request = t.choose(game)

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
    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Reformation')
    request = t.choose(game, 'yes') // Choose to tuck
    request = t.choose(game, 'Agriculture', 'Metalworking') // Tuck two cards
    request = t.choose(game, 'auto')

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
