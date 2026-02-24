Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("U.S. Declaration of Independence", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["U.S. Declaration of Independence"],
      },
      micah: {
        red: ['Robotics'],
        blue: ['Atomic Theory'],
        green: ['Databases'],
        hand: ['Canning', 'Enterprise'],
        score: ['Sailing', 'Navigation'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        hand: ['Canning'],
        score: ['Navigation'],
        museum: ['Museum 1', 'U.S. Declaration of Independence'],
      },
      micah: {
        green: ['Databases'],
        blue: ['Atomic Theory'],
        hand: ['Enterprise'],
        score: ['Sailing'],
      },
    })
  })
})
