Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Parnell Pitch Drop", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Parnell Pitch Drop"],
        purple: ['Lighting']
      },
      decks: {
        base: {
          8: ['Flight']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        purple: ['Lighting'],
        red: ['Flight'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Parnell Pitch Drop"],
        blue: ['Computers'],
      },
      decks: {
        base: {
          10: ['Databases'],
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Parnell Pitch Drop')
  })
})
