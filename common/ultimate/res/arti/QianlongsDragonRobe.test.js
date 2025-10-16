Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Qianlong's Dragon Robe", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Qianlong's Dragon Robe"],
      },
      micah: {
        red: ['Construction', 'Archery'],
        green: ['Paper', 'Measurement'],
        score: ['Machinery', 'Monotheism', 'Tools'],
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        score: ['Construction', 'Machinery'],
        hand: ['Monotheism'],
        museum: ['Museum 1', "Qianlong's Dragon Robe"],
      },
      micah: {
        red: ['Archery'],
        green: ['Measurement'],
        score: ['Tools'],
      }
    })
  })

  test('dogma: no cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Qianlong's Dragon Robe"],
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        museum: ['Museum 1', "Qianlong's Dragon Robe"],
      },
    })
  })
})
