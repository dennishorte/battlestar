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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Sailing', 'Tools')
    request = t.choose(game, 'auto')
    request = t.choose(game, 'Calendar')
    request = t.choose(game, 'The Wheel', 'Masonry')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Archery', 'Agriculture', 'Clothing', 'Mathematics'],
        museum: ['Museum 1', 'Maldives'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Maldives'],
      },
      micah: {
        green: ['Databases'],
      },
    })
  })
})
