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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Reformation', 'Experimentation', 'Enterprise'],
      },
    })
  })
})
