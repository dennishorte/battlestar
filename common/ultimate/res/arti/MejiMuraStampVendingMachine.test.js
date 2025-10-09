Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Meji-Mura Stamp Vending Machine", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Meji-Mura Stamp Vending Machine"],
        hand: ['Gunpowder'],
      },
      decks: {
        base: {
          4: ['Reformation', 'Experimentation', 'Enterprise'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation', 'Experimentation', 'Enterprise'],
        museum: ['Museum 1', 'Meji-Mura Stamp Vending Machine'],
      },
    })
  })
})
