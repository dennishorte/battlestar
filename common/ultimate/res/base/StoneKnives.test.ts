Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Stone Knives', () => {
  test('dogma: demand - opponent draws red card, transfers top red card', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Stone Knives'],
      },
      micah: {
        red: ['Gunpowder'], // Top red card to transfer
        hand: [],
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 red card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stone Knives')
    // Demand effect: Micah draws, reveals, and returns Fire (age 0, red)
    // Micah transfers top red card (Gunpowder) to dennis's board

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Gunpowder', 'Stone Knives'], // Gunpowder transferred on top
      },
      micah: {
        red: [], // Gunpowder transferred to dennis
      },
    })
  })

  test('dogma: second effect - Skinning is top card, draw {1}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Stone Knives'],
        yellow: ['Skinning'], // Skinning is a top card
      },
      micah: {
        hand: [],
      },
      decks: {
        base: {
          0: ['Curing'], // Age 0 card to draw for demand
          1: ['Tools'], // Age 1 card to draw if Skinning condition met
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stone Knives')
    // First effect: demand - micah draws, reveals, returns Curing (blue)
    // No blue card to transfer (micah has no blue cards)
    // Second effect: Skinning is a top card, so draw age 1 (Tools)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Stone Knives'],
        yellow: ['Skinning'],
        hand: ['Tools'], // Age 1 card drawn
      },
      micah: {
        hand: [],
      },
    })
  })

  test('dogma: second effect - Skinning is not top card, no draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Stone Knives'],
        yellow: ['Fresh Water', 'Skinning'], // Skinning is not top (Fresh Water is on top)
      },
      micah: {
        hand: [],
      },
      decks: {
        base: {
          0: ['Curing'], // Age 0 card to draw for demand
          1: ['Tools'], // Age 1 card to draw if Skinning condition met (but won't be drawn)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stone Knives')
    // First effect: demand - micah draws, reveals, returns Curing (blue)
    // No blue card to transfer
    // Second effect: Skinning is not a top card, so no age 1 draw

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Stone Knives'],
        yellow: ['Fresh Water', 'Skinning'], // Skinning not on top
        hand: [], // No age 1 draw
      },
      micah: {
        hand: [],
      },
    })
  })

  test('dogma: demand - opponent has no top card of revealed color, no transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        red: ['Stone Knives'],
      },
      micah: {
        red: ['Fire'], // Has red card, but will draw blue
        hand: [],
      },
      decks: {
        base: {
          0: ['Curing'], // Age 0 blue card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Stone Knives')
    // Demand effect: Micah draws, reveals, and returns Curing (age 0, blue)
    // Micah has no blue cards, so nothing to transfer

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Stone Knives'],
      },
      micah: {
        red: ['Fire'], // Fire not transferred (Curing is blue, Fire is red)
      },
    })
  })
})
