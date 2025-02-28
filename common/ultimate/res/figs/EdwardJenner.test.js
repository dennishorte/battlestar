Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Edward Jenner', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Edward Jenner'],
        hand: ['Antibiotics', 'The Wheel']
      },
      decks: {
        base: {
          6: ['Canning']
        },
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Antibiotics')

    t.testBoard(game, {
      dennis: {
        yellow: ['Edward Jenner', 'Antibiotics'],
        hand: ['The Wheel', 'Canning'],
      },
    })
  })

  test('karma: demand', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Archery']
      },
      micah: {
        yellow: ['Edward Jenner'],
        hand: ['The Wheel', 'Enterprise'],
      },
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')
    const request3 = t.choose(game, request2, 'Enterprise')

    t.testBoard(game, {
      dennis: {
        red: ['Archery']
      },
      micah: {
        yellow: ['Edward Jenner'],
        hand: ['The Wheel'],
      },
    })
  })

  test('karma: demand three player', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        red: ['Archery']
      },
      micah: {
        yellow: ['Edward Jenner'],
        hand: ['The Wheel', 'Enterprise'],
      },
      scott: {
        hand: ['Mathematics'],
      },
      decks: {
        base: {
          1: ['Sailing']
        }
      }
    })

    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Archery')
    const request3 = t.choose(game, request2, 'Enterprise')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery'],
        hand: ['Mathematics'],
      },
      micah: {
        yellow: ['Edward Jenner'],
        hand: ['The Wheel'],
      },
      scott: {
        hand: ['Sailing'],
      }
    })

  })
})
