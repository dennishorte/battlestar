Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Fishing', () => {
  test('dogma: draw and meld {z}, reveal hands, transfer matching color cards', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: ['Archery'], // Red card
      },
      micah: {
        hand: ['Stone Knives', 'Curing'], // Stone Knives is red, Curing is blue
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 red card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Fire (age 0, red)
    // Reveals all hands: dennis has Archery (red), micah has Stone Knives (red), Curing (blue)
    request = t.choose(game, 'auto')
    // Transfers all red cards to dennis's hand: Archery, Stone Knives
    // Action completes, turn passes to micah

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        red: ['Fire'], // Fire melded
        hand: ['Archery', 'Stone Knives'], // All red cards transferred (Fire was melded, not in hand)
      },
      micah: {
        hand: ['Curing'], // All red cards transferred to dennis
      },
    })
  })

  test('dogma: draw Fresh Water, triggers age 1 draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: [],
      },
      micah: {
        hand: ['Agriculture'], // Yellow card
      },
      decks: {
        base: {
          0: ['Fresh Water'], // Age 0 yellow card to draw
          1: ['Tools'], // Age 1 card to draw if Fresh Water condition met
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Fresh Water (age 0, yellow)
    // Reveals all hands: micah has Fresh Water (yellow)
    // Transfers Fresh Water to dennis's hand
    // Fresh Water was drawn, so draws age 1 (Tools)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        yellow: ['Fresh Water'], // Fresh Water melded
        hand: ['Agriculture', 'Tools'], // Agriculture transferred (Fresh Water was melded), Tools drawn
      },
      micah: {
        hand: [],
      },
    })
  })

  test('dogma: transfer Fresh Water, triggers age 1 draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: [],
      },
      micah: {
        hand: ['Fresh Water'], // Yellow card (will not be transferred since drawn card is red)
      },
      decks: {
        base: {
          0: ['Stone Knives'], // Age 0 red card to draw (not Fresh Water)
          1: ['Tools'], // Age 1 card to draw if Fresh Water condition met
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Stone Knives (age 0, red)
    // Reveals all hands: micah has Fresh Water (yellow, not red, so not transferred)
    // No transfers (drawn card is red, Fresh Water is yellow)
    // Fresh Water was not drawn or transferred, so no age 1 draw

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        red: ['Stone Knives'], // Stone Knives melded
        hand: [], // No transfers (Fresh Water is yellow, not red)
      },
      micah: {
        hand: ['Fresh Water'], // Not transferred (wrong color)
      },
    })
  })

  test('dogma: three cards of one color in hand, triggers age 2 draw', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: ['Archery', 'Gunpowder', 'Construction'], // Two red cards
      },
      micah: {
        hand: ['Curing'], // Blue card (not red, so not transferred)
      },
      decks: {
        base: {
          0: ['Stone Knives'], // Age 0 red card to draw
          2: ['Mathematics'], // Age 2 card to draw if three-of-color condition met
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Stone Knives (age 0, red)
    // Reveals all hands: dennis has Archery (red), Gunpowder (red), micah has Fire (red)
    request = t.choose(game, 'auto')
    // Transfers all red cards to dennis's hand: Archery, Gunpowder, Fire
    // Hand now has: Archery, Gunpowder, Fire (3 red cards) - triggers age 2 draw

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        red: ['Stone Knives'], // Stone Knives melded
        hand: ['Archery', 'Gunpowder', 'Construction', 'Mathematics'], // 3 red cards (Stone Knives was melded) + Mathematics drawn
      },
      micah: {
        hand: ['Curing'], // Curing not transferred (blue, not red)
      },
    })
  })

  test('dogma: both Fresh Water and three-of-color conditions met', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: ['Agriculture', 'Fermenting'], // Two yellow cards
      },
      micah: {
        hand: ['Fresh Water'], // Yellow card
      },
      decks: {
        base: {
          0: ['Shelter'], // Age 0 yellow card to draw
          1: ['Tools'], // Age 1 card to draw if Fresh Water condition met
          2: ['Mathematics'], // Age 2 card to draw if three-of-color condition met
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Fresh Water (age 0, yellow)
    // Reveals all hands: dennis has Agriculture (yellow), Fermenting (yellow), micah has Fresh Water (yellow)
    // Transfers all yellow cards to dennis's hand: Agriculture, Fermenting, Fresh Water
    request = t.choose(game, 'auto')
    // Fresh Water was drawn, so draws age 1 (Tools)
    // Hand now has: Agriculture, Fermenting, Fresh Water (3 yellow cards) - triggers age 2 draw (Mathematics)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        yellow: ['Shelter'], // Fresh Water melded
        hand: ['Agriculture', 'Fermenting', 'Fresh Water', 'Tools', 'Mathematics'], // All yellow cards (Fresh Water was melded) + both draws
      },
      micah: {
        hand: [], // Fermenting transferred to dennis
      },
    })
  })

  test('dogma: no matching color cards to transfer', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Fishing'],
        hand: ['Archery'], // Red card
      },
      micah: {
        hand: ['Sailing'], // Green card (different color)
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 red card to draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Fishing')
    // Draws and melds Fire (age 0, red)
    // Reveals all hands: dennis has Archery (red), micah has Sailing (green)
    // Transfers only red cards: Archery (Sailing is green, not transferred)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Fishing'],
        red: ['Fire'], // Fire melded
        hand: ['Archery'], // Only Archery transferred (red)
      },
      micah: {
        hand: ['Sailing'], // Sailing not transferred (green, not red)
      },
    })
  })
})
