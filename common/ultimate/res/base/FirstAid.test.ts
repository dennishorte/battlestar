Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('First Aid', () => {
  test('dogma: return card, draw {z}, exactly one matching card in hand (success)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Archery'], // Archery to return (red)
        hand: ['Gunpowder'], // Red card, will match returned card's color
      },
      decks: {
        base: {
          0: ['Fresh Water'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.First Aid')
    request = t.choose(game, request, 'Archery') // Return Archery (red)
    // Draws Fresh Water (age 0, yellow)
    // Hand now has: Gunpowder (red), Fresh Water (yellow)
    // Exactly one red card matches returned card's color, so meld Gunpowder

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Gunpowder'], // Gunpowder melded
        hand: ['Fresh Water'],
      },
    })
  })

  test('dogma: you lose (no matching card in hand after draw)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Archery'], // Archery to return (red)
        hand: ['Fishing'], // Green card, doesn't match
      },
      decks: {
        base: {
          0: ['Fresh Water'], // Age 0 yellow card to draw (different color, still no red)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.First Aid')
    request = t.choose(game, request, 'Archery') // Return Archery (red)
    // Draws Fresh Water (age 0, yellow)
    // Hand now has: Fishing (green), Fresh Water (yellow)
    // Zero red cards match returned card's color, so player loses

    t.testGameOver(request, 'micah', 'First Aid')
  })

  test('dogma: you lose (multiple matching cards in hand)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Archery'], // Archery to return (red)
        hand: ['Gunpowder', 'Construction'], // Two red cards
      },
      decks: {
        base: {
          0: ['Fishing'], // Age 0 green card to draw (different color)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.First Aid')
    request = t.choose(game, request, 'Archery') // Return Archery (red)
    // Draws Fishing (age 0, green)
    // Hand now has: Gunpowder (red), Construction (red), Fishing (green)
    // Two red cards match returned card's color, so player loses

    t.testGameOver(request, 'micah', 'First Aid')
  })

  test('dogma: return card, draw matching {z}, exactly one total', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Archery'], // Archery to return (red)
        hand: [], // Empty hand
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 red card to draw (matches returned color)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.First Aid')
    request = t.choose(game, request, 'Archery') // Return Archery (red)
    // Draws Fire (age 0, red)
    // Hand now has: Fire (red)
    // Exactly one red card matches returned card's color, so meld Fire

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Fire'], // Fire melded
        hand: [],
      },
    })
  })

  test('dogma: you lose (draw matching {z} makes two total)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        blue: ['First Aid'],
        red: ['Archery'], // Archery to return (red)
        hand: ['Gunpowder'], // Red card
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 red card to draw (same color as returned)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.First Aid')
    request = t.choose(game, request, 'Archery') // Return Archery (red)
    // Draws Fire (age 0, red)
    // Hand now has: Gunpowder (red), Fire (red)
    // Two red cards match returned card's color, so player loses

    t.testGameOver(request, 'micah', 'First Aid')
  })
})
