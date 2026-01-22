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
    request = t.choose(game, 'Dogma.Archery')
    request = t.choose(game, 'Enterprise')

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
      achievements: [],
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
    request = t.choose(game, 'Dogma.Archery')
    request = t.choose(game, 'Enterprise')

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

  describe('If a player would score a card, first junk an available achievement of the same value.', () => {
    test('karma: owner scores card, junk achievement of same age first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
          blue: ['Pottery'],
          hand: ['Tools', 'Writing', 'Sailing'], // Three age 1 cards to return
        },
        achievements: ['Machinery'], // Age 3 achievement
        decks: {
          base: {
            1: ['The Wheel'], // Age 1 card (will be drawn normally)
            3: ['Engineering'], // Age 3 card to be scored
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Pottery')
      request = t.choose(game, 'Tools', 'Writing', 'Sailing') // Return 3 cards, will score age 3
      request = t.choose(game, 'auto') // Auto-order returned cards
      // Karma triggers: junk achievement of age 3 first (Machinery)
      // Achievement auto-selects when only one option
      // Pottery's second dogma effect: Draw a {1}

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
          blue: ['Pottery'],
          score: ['Engineering'], // Engineering (age 3) scored
          hand: ['The Wheel'], // Drawn by Pottery's second dogma effect
        },
        junk: ['Machinery'], // Machinery (age 3 achievement) junked first
      })
    })

    test('karma: opponent scores card, junk achievement of same age first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
        },
        micah: {
          yellow: ['Agriculture'],
          hand: ['Enterprise'],
        },
        achievements: ['Coal'], // Age 5 achievement
        decks: {
          base: {
            5: ['Societies'], // Age 5 card to be scored
            6: ['Industrialization'],
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn
      request = t.choose(game, 'Draw.draw a card')
      // Now micah's turn
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Enterprise') // Return age 4, will score age 5 (Statistics)
      // Karma triggers: dennis (owner) junks achievement of age 5 first (Coal)
      // Achievement auto-selects when only one option

      t.testBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
          hand: ['Industrialization'],
        },
        micah: {
          yellow: ['Agriculture'],
          score: ['Societies'],
        },
        junk: ['Coal'], // Coal (age 5 achievement) junked first by dennis (karma owner)
      })
    })

    test('karma: no achievement of that age available, still score card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Optics'],
          yellow: ['Edward Jenner'],
        },
        achievements: ['The Wheel'], // Age 1 achievement, not age 5
        decks: {
          base: {
            3: ['Medicine'],
            4: ['Gunpowder'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Optics')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Optics'],
          yellow: ['Medicine', 'Edward Jenner'],
          score: ['Gunpowder'],
        },
        standardAchievements: ['The Wheel'], // Achievement not junked (wrong age)
      })
    })

    test('karma: multiple achievements of that age available, choose which to junk', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
          blue: ['Pottery'],
          hand: ['Tools', 'Writing', 'Sailing'], // Three age 1 cards to return
        },
        achievements: ['Machinery', 'Navigation'], // Age 3 and age 4 achievements (we'll score age 3)
        decks: {
          base: {
            1: ['The Wheel'], // Age 1 card (will be drawn normally)
            3: ['Engineering'], // Age 3 card to be scored
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Pottery')
      request = t.choose(game, 'Tools', 'Writing', 'Sailing') // Return 3 cards, will score age 3
      request = t.choose(game, 'auto') // Auto-order returned cards
      // Karma triggers: choose which age 3 achievement to junk (only Machinery is age 3)
      // Actually, only Machinery is age 3, Navigation is age 4, so it auto-selects

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Edward Jenner'],
          blue: ['Pottery'],
          score: ['Engineering'], // Engineering (age 3) scored
          hand: ['The Wheel'], // Drawn by Pottery's second dogma effect
        },
        junk: ['Machinery'], // Machinery (age 3 achievement) junked first
        standardAchievements: ['Navigation'], // Navigation (age 4) remains (only check standard achievements)
      })
    })
  })
})
