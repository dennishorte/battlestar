Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Babylonian Chronicles', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Babylonian Chronicles'],
        score: ['Paper'],
      },
      micah: {
        red: ['Archery'],
        yellow: ['Masonry'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          3: ['Machinery', 'Paper',],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        score: ['Paper'],
        hand: ['Sailing'],
      },
      micah: {
        red: ['Archery'],
        score: ['Machinery'],
      },
    })
  })
})
