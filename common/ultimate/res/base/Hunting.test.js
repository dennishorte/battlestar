Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hunting', () => {
  test('dogma: demand - opponent draws and reveals two {z}, leader chooses one to transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Hunting'],
      },
      micah: {
        hand: [],
      },
      decks: {
        base: {
          0: ['Fire', 'Stone Knives'], // Two age 0 cards to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hunting')
    // Demand effect: Micah draws and reveals Fire and Stone Knives
    // Dennis (leader) chooses which card to transfer to his board
    request = t.choose(game, request, 'Fire') // Choose Fire to transfer

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hunting'],
        red: ['Fire'], // Fire transferred to dennis's board
      },
      micah: {
        hand: ['Stone Knives'], // Stone Knives stays with micah
      },
    })
  })

  test('dogma: demand - transfer card when leader already has cards of that color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Hunting'],
        red: ['Archery'], // Already has red cards
      },
      micah: {
        hand: [],
      },
      decks: {
        base: {
          0: ['Fire', 'Stone Knives'], // Two red age 0 cards
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Hunting')
    // Demand effect: Micah draws and reveals Fire and Stone Knives (both red)
    // Dennis (leader) chooses which card to transfer to his board
    request = t.choose(game, request, 'Fire') // Choose Fire to transfer

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Hunting'],
        red: ['Fire', 'Archery'], // Fire transferred and placed on top
      },
      micah: {
        hand: ['Stone Knives'], // Stone Knives stays with micah
      },
    })
  })
})
