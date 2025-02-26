Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jiskairumoko Necklace", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        score: ['Tools'],
        achievements: ['Sailing', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        achievements: ['Sailing'],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Construction'],
      },
    })
  })

  test('dogma: nothing to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })
  })

  test('dogma: no matching achievements', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jiskairumoko Necklace"],
      },
      micah: {
        red: ['Metalworking'],
        score: ['Coal'],
        achievements: ['Sailing', 'Construction'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      micah: {
        red: ['Metalworking'],
        achievements: ['Sailing', 'Construction'],
      },
    })
  })

})
