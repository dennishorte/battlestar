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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')
    request = t.choose(game, request, 'auto')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Archery'],
        hand: ['Tools'],
        museum: ['Museum 1', 'Treaty of Kadesh'],
      },
      micah: {
        blue: ['Mathematics'],
        score: ['Oars'],
      },
    })
  })
})
