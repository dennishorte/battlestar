Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jumbo Kingdom", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        red: ['Coal', 'Archery'],
        artifact: ["Jumbo Kingdom"],
      },
      micah: {
        red: ['Construction', 'Road Building'],
        green: ['Paper'],
      },
      junk: ['Hypersonics', 'Statistics', 'Societies'],
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 5)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Coal', 'Archery', 'Construction', 'Road Building', 'Statistics', 'Societies'],
        museum: ['Museum 1', "Jumbo Kingdom"],
      },
      micah: {
        green: ['Paper'],
      },
      junk: ['Hypersonics'],
    })
  })
})
