Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Greenland", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Greenland"],
        green: ['Mapmaking', 'Sailing'],
        blue: ['Software'],
        purple: ['Specialization'],
      },
      micah: {
        yellow: ['Agriculture'],
        green: ['Navigation'],
        blue: ['Computers'],
        purple: ['Lighting'],
      },
      decks: {
        base: {
          10: ['Robotics'],
        }
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'Computers')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Software'],
        purple: ['Specialization'],
        hand: ['Robotics'],
        museum: ['Museum 1', "Greenland"],
      },
      micah: {
        yellow: ['Agriculture'],
      },
    })
  })
})
