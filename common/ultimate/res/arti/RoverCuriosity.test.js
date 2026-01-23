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
          10: ["Musk's Tesla Roadster"],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', "Musk's Tesla Roadster")
  })
})
