Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Marcha Real", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Marcha Real"],
        hand: ['Calendar', 'Robotics'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {})
  })

  test('dogma: color matches', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Marcha Real"],
        hand: ['Calendar', 'Computers'],
      },
      achievements: ['The Wheel', 'Robotics'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')
    const request4 = t.choose(game, request3, 'age 10')

    t.testIsFirstAction(request4)
    t.testBoard(game, {
      dennis: {
        achievements: ['Robotics'],
      },
    })
  })

  test('dogma: value matches', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Marcha Real"],
        hand: ['Calendar', 'Construction'],
      },
      decks: {
        base: {
          3: ['Machinery'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        hand: ['Machinery'],
      }
    })
  })
})
