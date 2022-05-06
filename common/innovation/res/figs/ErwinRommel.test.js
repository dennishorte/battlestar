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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Erwin Rommel')
    const request3 = t.choose(game, request2, '**base-4*')

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

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Agriculture')
    const request3 = t.choose(game, request2, 'The Wheel')

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
