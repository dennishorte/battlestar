Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("DigitalPet", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    t.setBoard(game,  {
      dennis: {
        green: ['Barcode'],
        yellow: ['DigitalPet'],
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
    request = t.choose(game, request, 'Dogma.DigitalPet')
    request = t.choose(game, request, 4)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Colonialism', 'Engineering'],
        green: ['Barcode'],
        yellow: ['DigitalPet'],
      },
    })
  })
})
