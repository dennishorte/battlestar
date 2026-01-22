Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Babylonian Chronicles', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Babylonian Chronicles'],
        score: ['Engineering'],
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
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        score: ['Engineering', 'Paper'],
        hand: ['Sailing'],
        museum: ['Museum 1', 'Babylonian Chronicles'],
      },
      micah: {
        red: ['Archery'],
        score: ['Machinery'],
      },
    })
  })
})
