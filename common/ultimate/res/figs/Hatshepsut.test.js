Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hatshepsut', () => {

  test('karma (one in hand)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        blue: ['Writing'],
        hand: ['The Wheel', 'Enterprise']
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting', 'Construction']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Writing')
    request = t.choose(game, request, 'auto')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        blue: ['Writing'],
        hand: ['Calendar', 'Fermenting', 'Construction']
      },
    })
  })

  test('karma (no one in hand)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        blue: ['Writing'],
        hand: ['Enterprise']
      },
      decks: {
        base: {
          2: ['Calendar']
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Writing')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        blue: ['Writing'],
        hand: ['Calendar', 'Enterprise']
      },
    })
  })
})
