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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        achievements: ['Software'],
        museum: ['Museum 1', 'Shroud of Turin'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Compass'],
        score: ['Sailing'],
        museum: ['Museum 1', 'Shroud of Turin'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Shroud of Turin'],
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', 'Shroud of Turin'],
      }
    })
  })
})
