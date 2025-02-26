Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Maldives", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Maldives"],
        score: ['Archery', 'Agriculture', 'Masonry', 'Clothing', 'The Wheel', 'Mathematics'],
      },
      micah: {
        green: ['Databases'],
        hand: ['Tools', 'Sailing', 'Canning', 'Coal'],
        score: ['Construction', 'Calendar', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'Sailing', 'Tools')
    const request4 = t.choose(game, request3, 'auto')
    const request5 = t.choose(game, request4, 'Calendar')
    const request6 = t.choose(game, request5, 'The Wheel', 'Masonry')
    const request7 = t.choose(game, request6, 'auto')

    t.testIsFirstAction(request7)
    t.testBoard(game, {
      dennis: {
        score: ['Archery', 'Agriculture', 'Clothing', 'Mathematics'],
      },
      micah: {
        green: ['Databases'],
        hand: ['Canning', 'Coal'],
        score: ['Construction', 'Enterprise'],
      },
    })
  })

  test('dogma: no cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Maldives"],
      },
      micah: {
        green: ['Databases'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
      },
      micah: {
        green: ['Databases'],
      },
    })
  })
})
