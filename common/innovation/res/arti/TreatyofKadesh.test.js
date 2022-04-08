Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Treaty of Kadesh", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Treaty of Kadesh"],
        red: ['Archery'],
        green: ['Sailing'],
      },
      micah: {
        blue: ['Mathematics'],
        red: ['Construction', 'Oars'],
        green: ['Mapmaking'],
        purple: ['Feudalism'],
      },
      decks: {
        base: {
          1: ['Tools']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsFirstAction(request3)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Archery'],
        hand: ['Tools'],
      },
      micah: {
        blue: ['Mathematics'],
        score: ['Oars'],
      },
    })
  })
})
