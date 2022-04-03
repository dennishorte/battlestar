Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe("Priest-King", () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Priest-King"],
        green: ['Sailing'],
        hand: ['The Wheel'],
      },
      decks: {
        base: {
          1: ['Masonry'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        green: ['Sailing'],
        score: ['The Wheel'],
      }
    })
  })

  test('dogma: achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ["Priest-King"],
        green: ['Sailing'],
        hand: ['The Wheel'],
        score: ['Canning'],
      },
      decks: {
        base: {
          1: ['Masonry'],
        }
      },
      achievements: ['Pottery'],
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        yellow: ['Masonry'],
        green: ['Sailing'],
        score: ['The Wheel', 'Canning'],
        achievements: ['Pottery'],
      }
    })
  })
})
