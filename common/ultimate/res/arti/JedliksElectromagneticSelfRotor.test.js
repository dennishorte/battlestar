Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jedlik's Electromagnetic Self-Rotor", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jedlik's Electromagnetic Self-Rotor"],
      },
      achievements: ['Lighting', 'Rocketry', 'Tools'],
      decks: {
        base: {
          8: ['Flight', 'Socialism']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Socialism'],
        score: ['Flight'],
        achievements: ['Rocketry'],
      },
    })
  })

})
