Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Telegraph", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Telegraph', 'Metric System'],
        yellow: ['Masonry', 'Agriculture'],
        blue: ['Atomic Theory', 'Mathematics'],
      },
      micah: {
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Telegraph')
    request = t.choose(game, request, 'green right')
    request = t.choose(game, request, 'blue')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: {
          cards: ['Telegraph', 'Metric System'],
          splay: 'right'
        },
        blue: {
          cards: ['Atomic Theory', 'Mathematics'],
          splay: 'up'
        },
        yellow: ['Masonry', 'Agriculture'],
      },
      micah: {
        red: {
          cards: ['Archery', 'Construction'],
          splay: 'left'
        },
        green: {
          cards: ['Navigation', 'Sailing'],
          splay: 'right'
        },
      },
    })
  })
})
