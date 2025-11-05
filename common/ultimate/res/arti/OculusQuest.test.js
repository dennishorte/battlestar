Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Oculus Quest", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Paper'],
        artifact: ["Oculus Quest"],
      },
      micah: {
        red: ['Coal', 'Archery'],
        blue: ['Software'],
        score: ['Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        museum: ['Museum 1', "Oculus Quest"],
      },
      micah: {
        hand: ['Coal', 'Archery', 'Software'],
        score: ['Construction'],
      },
    })
  })
})
