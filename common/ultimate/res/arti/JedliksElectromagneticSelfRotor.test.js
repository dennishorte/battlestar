Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Jedlik's Electromagnetic Self-Rotor", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jedlik's Electromagnetic Self-Rotor"],
      },
      decks: {
        base: {
          8: ['Flight', 'Socialism']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')
    request = t.choose(game, 4)

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        purple: ['Socialism'],
        score: ['Flight'],
        museum: ['Museum 1', "Jedlik's Electromagnetic Self-Rotor"],
      },
    })
    t.testDeckIsJunked(game, 4)
  })

  test('dogma: not a 8', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Jedlik's Electromagnetic Self-Rotor"],
      },
      decksExact: {
        base: {
          8: ['Flight'],
          9: ['Computers'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        blue: ['Computers'],
        score: ['Flight'],
        museum: ['Museum 1', "Jedlik's Electromagnetic Self-Rotor"],
      },
    })
  })

})
