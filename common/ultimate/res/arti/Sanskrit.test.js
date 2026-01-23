Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Sanskrit", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        score: ['Machinery'],
        artifact: ["Sanskrit"],
      },
      micah: {
        score: ['Tools', 'Paper'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Sanskrit"],
      },
      junk: ['Machinery', 'Tools', 'Paper'],
    })
  })

  test('dogma: no scores', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Robotics'],
        green: ['Paper', 'Sailing'],
        artifact: ["Sanskrit"],
      },
      micah: {
        red: ['Archery'],
        blue: ['Mathematics', 'Tools'],
        purple: ['Monotheism'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 'Monotheism')
    request = t.choose(game, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        green: ['Paper', 'Sailing'],
        museum: ['Museum 1', "Sanskrit"],
      },
      micah: {
        blue: ['Tools'],
        purple: ['Monotheism'],
        score: ['Archery', 'Mathematics'],
      }
    })
  })
})
