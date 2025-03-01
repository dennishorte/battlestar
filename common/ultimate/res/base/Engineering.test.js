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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Engineering')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'red')

    t.testIsSecondPlayer(game)
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
