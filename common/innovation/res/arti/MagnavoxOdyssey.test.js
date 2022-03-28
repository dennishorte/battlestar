Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Magnavox Odyssey", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Magnavox Odyssey"],
      },
      decks: {
        base: {
          10: ['Software', 'Robotics'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        blue: ['Software'],
      },
    })
  })

  test('dogma: you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Magnavox Odyssey"],
      },
      decks: {
        base: {
          10: ['Software', 'Bioengineering'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testGameOver(request2, 'dennis', 'Magnavox Odyssey')
  })
})
