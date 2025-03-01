Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sun Tzu', () => {

  test('inspire', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sun Tzu'],
      },
      decks: {
        base: {
          2: ['Calendar', 'Fermenting'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.red')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sun Tzu'],
        hand: ['Calendar', 'Fermenting'],
      },
    })
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Sun Tzu', 'War')
  })

  test('karma', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sun Tzu'],
        green: ['The Wheel'],
        hand: ['Fermenting'],
      },
      micah: {
        yellow: ['Masonry'],
        purple: ['Monotheism'],
      },
      decks: {
        base: {
          1: ['Tools', 'Domestication', 'Sailing', 'Archery'],
        },
        figs: {
          2: ['Archimedes'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.The Wheel')

    t.testChoices(request, ['Fermenting', 'Archery'])

    request = t.choose(game, request, 'Fermenting', 'Archery')
    request = t.choose(game, request, 'Archery')

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Archery', 'Sun Tzu'],
        green: ['The Wheel'],
        yellow: ['Fermenting'],
        hand: ['Sailing', 'Archimedes'],
      },
      micah: {
        yellow: ['Masonry'],
        purple: ['Monotheism'],
        hand: ['Tools', 'Domestication'],
      },
    })
  })
})
