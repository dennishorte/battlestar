Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Galleon Nuestra Senora De Atocha", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Galleon Nuestra Senora De Atocha"],
      },
      micah: {
        red: ['Coal'],
        blue: ['Mathematics'],
        score: ['Sailing', 'Calendar', 'Construction'],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 2)
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Mathematics'],
        score: ['Calendar', 'Construction'],
        museum: ['Museum 1', 'Galleon Nuestra Senora De Atocha'],
      },
      micah: {
        red: ['Coal'],
        score: ['Sailing'],
      },
    })
  })
})
