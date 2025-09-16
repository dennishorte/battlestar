Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("United Nations Charter", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["United Nations Charter"],
        red: ['Archery'],
      },
      micah: {
        red: ['Construction', 'Oars'],
        green: ['The Wheel'],
        purple: ['Feudalism'],
        blue: ['Pottery'],
      },
      decks: {
        base: {
          1: ['Sailing'],
          10: ['Software', 'Robotics'],
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
        red: ['Archery'],
        score: ['Construction', 'Feudalism'],
        hand: ['Robotics', 'Sailing'],
      },
      micah: {
        red: ['Oars'],
        green: ['The Wheel'],
        blue: ['Pottery'],
        hand: ['Software'],
      },
    })
  })
})
