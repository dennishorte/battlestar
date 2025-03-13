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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')
    request = t.choose(game, request, 'age 10')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        hand: ['Machinery'],
      }
    })
  })
})
