Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hatshepsut', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
      },
      decks: {
        base: {
          1: ['The Wheel', 'Mysticism']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')

    t.testBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        hand: ['The Wheel', 'Mysticism']
      },
    })
  })

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Writing')
    const request3 = t.choose(game, request2, 'auto')

    t.testIsSecondPlayer(request3)
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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Writing')

    t.testIsSecondPlayer(request2)
    t.testBoard(game, {
      dennis: {
        green: ['Hatshepsut'],
        blue: ['Writing'],
        hand: ['Calendar', 'Enterprise']
      },
    })
  })
})
