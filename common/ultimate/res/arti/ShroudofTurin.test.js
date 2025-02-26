Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Shroud of Turin", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Shroud of Turin"],
        green: ['Compass'],
        score: ['Sailing'],
        hand: ['Navigation'],
      },
      achievements: ['Software'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        achievements: ['Software'],
      }
    })
  })

  test('dogma: empty hand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Shroud of Turin"],
        green: ['Compass'],
        score: ['Sailing'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Compass'],
        score: ['Sailing'],
      }
    })
  })

  test('dogma: empty score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Shroud of Turin"],
        green: ['Compass'],
        hand: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
      }
    })
  })

  test('dogma: empty stack', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Shroud of Turin"],
        score: ['Compass'],
        hand: ['Navigation'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
      }
    })
  })
})
