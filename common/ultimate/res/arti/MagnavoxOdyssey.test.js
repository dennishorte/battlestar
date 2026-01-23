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
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        red: ['Robotics'],
        blue: ['Software'],
        museum: ['Museum 1', 'Magnavox Odyssey'],
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
    request = t.choose(game, 'dogma')

    t.testGameOver(request, 'dennis', 'Magnavox Odyssey')
  })
})
