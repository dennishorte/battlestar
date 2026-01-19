Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Foraging', () => {
  test('dogma: draw {z} with {r}, no reveal/score option', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Fire'], // Age 0 card with {r} biscuit
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Fire (age 0, has {r} biscuit)
    // No reveal/score option since it has {r}

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        hand: ['Fire'], // Fire drawn to hand
      },
    })
  })

  test('dogma: draw {z} without {r}, choose to reveal and score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Stone Knives', 'Curing'], // Age 0 cards without {r} biscuit
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Stone Knives (age 0, no {r} biscuit)
    request = t.choose(game, request, 'yes') // Choose to reveal and score
    // Reveals, scores Stone Knives, then draws another {z} (Curing)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        score: ['Stone Knives'], // Stone Knives scored
        hand: ['Curing'], // Curing drawn to hand
      },
    })
  })

  test('dogma: draw {z} without {r}, choose not to reveal and score', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Stone Knives'], // Age 0 card without {r} biscuit
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Stone Knives (age 0, no {r} biscuit)
    request = t.choose(game, request, 'no') // Choose not to reveal and score
    // Stone Knives stays in hand, no second draw

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        hand: ['Stone Knives'], // Stone Knives in hand, not scored
        score: [],
      },
    })
  })

  test('dogma: draw {z} without {r}, reveal and score, then draw another {z} with {r}', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Stone Knives', 'Fire'], // First without {r}, second with {r}
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Stone Knives (age 0, no {r} biscuit)
    request = t.choose(game, request, 'yes') // Choose to reveal and score
    // Reveals, scores Stone Knives, then draws Fire (has {r}, so no second reveal/score option)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        score: ['Stone Knives'], // Stone Knives scored
        hand: ['Fire'], // Fire drawn to hand (has {r}, so no reveal/score)
      },
    })
  })

  test('dogma: draw {z} without {r}, reveal and score, then draw another {z} (no second reveal option)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Stone Knives', 'Curing'], // Both without {r} biscuit
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Stone Knives (age 0, no {r} biscuit)
    request = t.choose(game, request, 'yes') // Choose to reveal and score
    // Reveals, scores Stone Knives, then draws Curing
    // Note: The second draw doesn't get the reveal/score option (it's only for the first draw)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        score: ['Stone Knives'], // Only Stone Knives scored
        hand: ['Curing'], // Curing drawn to hand (no second reveal/score option)
      },
    })
  })

  test('dogma: draw {z} without {r}, reveal and score, then draw another {z} with {r} (no second reveal option)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'surv'], useAgeZero: true })
    t.setBoard(game, {
      dennis: {
        green: ['Foraging'],
      },
      decks: {
        base: {
          0: ['Stone Knives', 'Fire'], // First without {r}, second with {r}
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Foraging')
    // Draws Stone Knives (age 0, no {r} biscuit)
    request = t.choose(game, request, 'yes') // Choose to reveal and score
    // Reveals, scores Stone Knives, then draws Fire (has {r})
    // Note: The second draw doesn't get the reveal/score option regardless

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Foraging'],
        score: ['Stone Knives'], // Only Stone Knives scored
        hand: ['Fire'], // Fire drawn to hand (no second reveal/score option)
      },
    })
  })
})
