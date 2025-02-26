Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Rover Curiosity", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Rover Curiosity"],
        score: ['Tools'],
      },
      decks: {
        arti: {
          10: ['Maastricht Treaty'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Maastricht Treaty')
  })
})
