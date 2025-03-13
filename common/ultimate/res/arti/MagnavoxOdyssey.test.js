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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testIsFirstAction(request)
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

    let request
    request = game.run()
    request = t.choose(game, request, 'dogma')

    t.testGameOver(request, 'dennis', 'Magnavox Odyssey')
  })
})
