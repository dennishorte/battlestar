Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Drone", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Barcode'],
        red: ['Drone'],
      },
      decks: {
        base: {
          3: ['Engineering'],
          4: ['Colonialism'],
        },
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Drone')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Colonialism', 'Engineering'],
        green: ['Barcode'],
        red: ['Drone'],
      },
    })
  })
})
