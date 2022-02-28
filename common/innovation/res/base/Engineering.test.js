Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Engineering', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Engineering', 'Construction'],
        yellow: ['Masonry'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
        red: ['Archery'],
        purple: ['City States'],
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Engineering')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'red')

    t.testIsSecondPlayer(request4)
    t.testBoard(game, {
      dennis: {
        red: {
          cards: ['Engineering', 'Construction'],
          splay: 'left',
        },
        yellow: ['Masonry'],
        score: ['Archery', 'City States'],
      },
      micah: {
        blue: ['Writing'],
        green: ['Sailing'],
      }
    })
  })
})
