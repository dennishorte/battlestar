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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Industrialization', 'Archery'],
        blue: ['Mathematics', 'Tools'],
        purple: ['Enterprise'],
        green: ['Sailing'],
        score: ['Canning'],
        museum: ['Museum 1', 'Pride and Prejudice'],
      }
    })
  })
})
