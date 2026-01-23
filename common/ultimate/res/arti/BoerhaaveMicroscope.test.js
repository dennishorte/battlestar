Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Boerhavve Microscope', () => {

  test('dogma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Boerhavve Microscope'],
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

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        green: ['Paper'],
        hand: ['Enterprise'],
        score: ['Machinery'],
        museum: ['Museum 1', 'Boerhavve Microscope'],
      }
    })
  })

  test('dogma: nothing to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'arti'] })
    t.setBoard(game,  {
      dennis: {
        artifact: ['Boerhavve Microscope'],
      },
      decks: {
        base: {
          1: ['Sailing'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'dogma')

    t.testIsFirstAction(request)
    t.testBoard(game, {
      dennis: {
        score: ['Sailing'],
        museum: ['Museum 1', 'Boerhavve Microscope'],
      }
    })
  })
})
