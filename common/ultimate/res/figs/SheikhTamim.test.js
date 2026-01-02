Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sheikh Tamim', () => {
  test('karma: dogma card with featured icon, return red card with that icon, issue War decree', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim on top (karma active)
        purple: ['Mysticism'], // Mysticism has dogmaBiscuit 'k' (featured icon), on different color
        hand: ['Metalworking'], // Metalworking is red and has 'k' biscuit (kkhk) to return
      },
      micah: {
        yellow: ['Masonry'], // Age 1 card for War decree to return
      },
      decks: {
        base: {
          1: ['Clothing', 'The Wheel'], // Card drawn by Mysticism's dogma (green, doesn't match red/purple, stays in hand)
        },
        figs: {
          11: ['Giuseppe Scionti'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')
    // Karma triggers: first return a card from hand with featured icon 'k'
    // Metalworking has 'k' biscuit and is red
    request = t.choose(game, request, 'Metalworking') // Return Metalworking
    // War decree is issued (red card returned)
    // War decree: choose a value, return all top cards of that value from all other players' boards
    request = t.choose(game, request, 1) // Choose age 1
    // Masonry (age 1) is returned from micah's board

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim remains on top
        purple: ['Mysticism'], // Mysticism remains
        hand: ['Giuseppe Scionti', 'The Wheel'], // Initial hand cards (from fixture setup)
        achievements: ['War'], // War decree was issued
      },
      micah: {
        yellow: [], // Masonry was returned by War decree
        hand: ['Clothing'], // Clothing drawn by Mysticism's dogma (green, doesn't match red/purple, stays in hand)
      },
    })
  })

  test('karma: dogma card with featured icon, do not return card, no decree', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim on top (karma active)
        purple: ['Mysticism'], // Mysticism has dogmaBiscuit 'k' (featured icon)
        hand: ['Metalworking'], // Metalworking has 'k' biscuit but not returned
      },
      decks: {
        base: {
          1: ['Clothing'], // Card drawn by Mysticism's dogma
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')
    // Karma triggers: first return a card from hand with featured icon 'k'
    // Choose not to return Metalworking (min: 0)
    request = t.choose(game, request) // Return nothing
    // No decree is issued

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim remains on top
        purple: ['Mysticism'], // Mysticism remains
        hand: ['Metalworking', 'Clothing'], // Metalworking remains, plus initial hand
      },
    })
  })

  test('karma: dogma card with featured icon, no card in hand with that icon, no decree', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim on top (karma active)
        purple: ['Mysticism'], // Mysticism has dogmaBiscuit 'k' (featured icon)
        hand: ['Mathematics'], // Mathematics has biscuits 'hscs' (no 'k')
      },
      decks: {
        base: {
          1: ['Clothing'], // Card drawn by Mysticism's dogma
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')
    // Karma triggers: first return a card from hand with featured icon 'k'
    // Mathematics doesn't have 'k', so no cards available to return
    // No choice is presented (empty choices), so no decree is issued

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim remains on top
        purple: ['Mysticism'], // Mysticism remains
        hand: ['Mathematics', 'Clothing'], // Mathematics remains, plus initial hand
        achievements: [], // No decree issued
      },
      micah: {
        hand: [], // No cards in micah's hand
      },
    })
  })

  test('karma: dogma card with featured icon, multiple cards with that icon, choose one to return', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim on top (karma active)
        purple: ['Mysticism'], // Mysticism has dogmaBiscuit 'k' (featured icon)
        hand: ['Metalworking', 'Archery'], // Both have 'k' biscuit and are red
      },
      micah: {
        yellow: ['Masonry'], // Age 1 card for War decree to return
      },
      decks: {
        base: {
          1: ['Clothing', 'The Wheel'], // Card drawn by Mysticism's dogma
        },
        figs: {
          11: ['Giuseppe Scionti'],
        },
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Mysticism')
    // Karma triggers: first return a card from hand with featured icon 'k'
    // Both Metalworking and Archery have 'k' biscuit and are red
    // Choose Metalworking to return
    request = t.choose(game, request, 'Metalworking') // Return Metalworking
    // War decree is issued (red card returned)
    request = t.choose(game, request, 1) // Choose age 1 for War decree

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Sheikh Tamim'], // Sheikh Tamim remains on top
        purple: ['Mysticism'], // Mysticism remains
        hand: ['Giuseppe Scionti', 'The Wheel'], // Initial hand cards (Archery was not in hand or was returned)
        achievements: ['War'], // War decree was issued
      },
      micah: {
        yellow: [], // Masonry was returned by War decree
        hand: ['Clothing'], // Clothing drawn by Mysticism's dogma
      },
    })
  })
})
