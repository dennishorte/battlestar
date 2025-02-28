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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Safety Pin')
    const request3 = t.choose(game, request2, 'auto')

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
