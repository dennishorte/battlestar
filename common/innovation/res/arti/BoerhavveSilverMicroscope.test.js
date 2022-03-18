Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Boerhavve Silver Microscope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Boerhavve Silver Microscope'],
        blue: ['Pottery'],
        green: ['Paper'],
        hand: ['Calendar', 'Enterprise'],
      },
      decks: {
        base: {
          3: ['Machinery']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        hand: ['Enterprise'],
        score: ['Machinery'],
      }
    })
  })

  test('dogma: nothing to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Boerhavve Silver Microscope'],
      },
      decks: {
        base: {
          1: ['Sailing'],
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'dogma')

    t.testIsFirstAction(request2)
    t.testBoard(game, {
      dennis: {
        score: ['Sailing'],
      }
    })
  })
})
