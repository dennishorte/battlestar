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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Maastricht Treaty')
  })
})
