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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Telegraph')
    const request3 = t.choose(game, request2, 'green right')
    const request4 = t.choose(game, request3, 'blue')

    t.testIsSecondPlayer(request4)
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
