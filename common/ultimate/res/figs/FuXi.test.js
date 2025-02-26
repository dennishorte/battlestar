Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fu Xi', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Fu Xi'],
      },
      decks: {
        base: {
          2: ['Calendar']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Fu Xi')

    t.testBoard(game, {
      dennis: {
        green: ['Fu Xi'],
        score: ['Calendar']
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Fu Xi', 'Trade')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Fu Xi'],
        score: ['Calendar', 'Software'],
        forecast: ['Alexander the Great', 'Enterprise']
      },
    })

    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).s).toBe(4)
  })

})
