Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Social Network", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Social Network'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Navigation'],
        purple: ['Mysticism'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Social Network')
    const request3 = t.choose(game, request2, '{f}')
    const request4 = t.choose(game, request3, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Social Network'],
        score: ['Navigation', 'Mysticism'],
      },
      micah: {
        yellow: ['Canning'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Social Network'],
      },
      micah: {
        yellow: ['Canning'],
        green: ['Navigation', 'Mapmaking'],
        purple: ['Mysticism', 'Monotheism'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Social Network')
    const request3 = t.choose(game, request2, '{f}')
    const request4 = t.choose(game, request3, 'auto')

    t.testGameOver(request4, 'dennis', 'Social Network')
  })
})
