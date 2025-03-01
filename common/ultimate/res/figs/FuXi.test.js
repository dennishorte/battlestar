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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Fu Xi')

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

    let request
    request = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).s).toBe(4)
  })

})
