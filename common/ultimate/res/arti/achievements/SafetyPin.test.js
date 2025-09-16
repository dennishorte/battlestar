Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe("Safety Pin", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        yellow: ["Safety Pin"],
      },
      micah: {
        hand: ['Coal', 'Canning', 'Lighting', 'Flight'],
      },
      decks: {
        base: {
          6: ['Industrialization'],
          7: ['Combustion'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Safety Pin')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        yellow: ["Safety Pin"],
        score: ['Combustion'],
      },
      micah: {
        hand: ['Coal', 'Canning', 'Industrialization'],
      },
    })
  })
})
