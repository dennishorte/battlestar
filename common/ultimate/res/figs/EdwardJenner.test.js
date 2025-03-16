Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Edward Jenner', () => {


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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, 'Enterprise')

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

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, 'Enterprise')

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
