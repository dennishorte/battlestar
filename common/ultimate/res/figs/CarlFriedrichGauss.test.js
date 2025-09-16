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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Carl Friedrich Gauss')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Quantum Theory')
    request = t.choose(game, request, 1)
    request = t.choose(game, request, 'Sailing')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Quantum Theory')
    request = t.choose(game, request, 8)

    t.testBoard(game, {
      dennis: {
        blue: ['Quantum Theory', 'Carl Friedrich Gauss'],
        score: ['The Wheel', 'Construction'],
        hand: ['Sailing', 'Enterprise'],
      },
    })
  })
})
