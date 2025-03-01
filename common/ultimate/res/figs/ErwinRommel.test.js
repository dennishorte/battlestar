Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Erwin Rommel', () => {

  test('echo (and forecast in hand karma)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Erwin Rommel'],
      },
      micah: {
        score: ['The Wheel', 'Enterprise']
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Erwin Rommel')
    request = t.choose(game, request, '**base-4* (micah)')

    t.testBoard(game, {
      dennis: {
        red: ['Erwin Rommel'],
        score: ['Enterprise']
      },
      micah: {
        score: ['The Wheel']
      }
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Erwin Rommel', 'War')
  })

  test('karma: score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Erwin Rommel'],
        yellow: ['Agriculture'],
        blue: ['Computers'],
        hand: ['The Wheel'],
      },
      micah: {
        blue: ['Mathematics'],
        purple: ['Enterprise'],
      },
      decks: {
        base: {
          2: ['Calendar'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Agriculture')
    request = t.choose(game, request, 'The Wheel')

    t.setBoard(game, {
      dennis: {
        red: ['Erwin Rommel'],
        yellow: ['Agriculture'],
        blue: ['Computers'],
        hand: ['Calendar'],
        score: ['Computers', 'Mathematics']
      },
      micah: {
        purple: ['Enterprise'],
      },
    })
  })

})
