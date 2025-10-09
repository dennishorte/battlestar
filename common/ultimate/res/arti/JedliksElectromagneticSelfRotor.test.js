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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Socialism'],
        score: ['Flight'],
        achievements: ['Rocketry'],
        museum: ['Museum 1', "Jedlik's Electromagnetic Self-Rotor"],
      },
    })
  })

})
