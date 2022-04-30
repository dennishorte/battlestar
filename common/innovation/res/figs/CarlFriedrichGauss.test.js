Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Carl Friedrich Gauss', () => {

  test('echo', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Carl Friedrich Gauss'],
      },
      decks: {
        base: {
          7: ['Lighting']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Carl Friedrich Gauss')

    t.testBoard(game, {
      dennis: {
        blue: ['Carl Friedrich Gauss'],
        hand: ['Lighting']
      },
    })
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Carl Friedrich Gauss'],
        score: ['The Wheel', 'Construction'],
        hand: ['Quantum Theory', 'Sailing', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Quantum Theory')
    const request3 = t.choose(game, request2, 1)
    const request4 = t.choose(game, request3, 'Sailing')

    t.testBoard(game, {
      dennis: {
        green: ['The Wheel', 'Sailing'],
        blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
        score: ['Construction'],
        hand: ['Enterprise'],
      },
    })
  })

  test('karma (choose same age as card being melded)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Carl Friedrich Gauss'],
        score: ['The Wheel', 'Construction'],
        hand: ['Quantum Theory', 'Sailing', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Quantum Theory')
    const request3 = t.choose(game, request2, 8)

    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
        score: ['The Wheel', 'Construction'],
        hand: ['Sailing', 'Enterprise'],
      },
    })
  })
})
