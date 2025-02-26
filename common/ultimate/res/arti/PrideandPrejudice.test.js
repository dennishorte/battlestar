Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Pride and Prejudice", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Pride and Prejudice"],
        red: ['Archery'],
        green: ['Sailing'],
        blue: ['Mathematics', 'Tools'],
        purple: ['Enterprise'],
      },
      decks: {
        base: {
          6: ['Canning', 'Industrialization'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Archery'],
        blue: ['Mathematics', 'Tools'],
        purple: ['Enterprise'],
        green: ['Sailing'],
        score: ['Canning'],
      }
    })
  })
})
