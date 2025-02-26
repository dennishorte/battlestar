Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Roundhay Garden Scene", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Roundhay Garden Scene"],
        score: ['Tools', 'Experimentation'],
      },
      decks: {
        base: {
          4: ['Enterprise', 'Gunpowder'],
          5: ['Astronomy'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        blue: ['Experimentation'],
        purple: ['Astronomy'],
        score: ['Tools', 'Enterprise', 'Gunpowder'],
      },
    })
  })
})
