Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Konstantin Novoselov', () => {
  test('karma: does not trigger on first action', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Konstantin Novoselov'], // Owner of karma card
        red: ['Archery'], // Card to dogma
      },
      micah: {
        hand: ['Gunpowder'], // Card that would be transferred if Archery dogma executed
      },
      achievements: ['Sailing', 'Philosophy'],
      decks: {
        base: {
          1: ['Tools'], // Card for Archery's demand effect
        }
      }
    })

    let request
    request = game.run()
    // First action: Dogma Archery - karma should NOT trigger (actionNumber === 1)
    request = t.choose(game, request, 'Dogma.Archery')
    request = t.choose(game, request, '**base-2*')
    // Archery's dogma executes normally: "I demand you draw a {1}, then transfer the highest card in your hand to my hand!"
    // dennis (owner) draws Tools, transfers highest (Tools) to himself (no change)
    // micah (opponent, demanded) draws nothing (no cards left), transfers highest (Gunpowder) to dennis
    // "Junk an available achievement of value 1 or 2."
    // Junk Philosophy achievement (age 2)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Konstantin Novoselov'],
        red: ['Archery'], // Archery was dogmatized normally (karma did not trigger)
        hand: ['Gunpowder'], // Gunpowder transferred from micah
      },
      micah: {
        hand: ['Tools'], // Tools drawn by Archery's demand effect
      },
      junk: ['Philosophy'], // Philosophy achievement was junked by Archery's second effect (age 2)
    })
  })

  describe('karma: second action, super-execute each color', () => {
    test('red: Archery', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          red: ['Archery'],
          blue: ['Konstantin Novoselov'],
          green: ['Sailing'], // Added green card to dogma instead of Konstantin Novoselov
        },
        decks: {
          base: {
            1: [
              'Pottery',   // dennis Draw.draw a card
              'Clothing',  // dennis Archery demand
              'Tools',     // micah Sailing dogma
            ],
            11: [
              'Hypersonics',  // micah Draw.draw a card
            ],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Sailing') // Dogma Sailing (green) instead of Konstantin Novoselov
      request = t.choose(game, request, 'Clothing') // Card drawn by Archery's super-execution

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          red: ['Archery'],
          blue: ['Tools', 'Konstantin Novoselov'],
          green: ['Sailing'],
          hand: ['Hypersonics', 'Clothing'],
        },
      })
    })

    test('yellow: Agriculture', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          red: ['Archery'], // Added red card to dogma instead of Konstantin Novoselov
          blue: ['Konstantin Novoselov'],
          yellow: ['Agriculture'],
          hand: ['Philosophy'],
        },
        achievements: ['The Wheel', 'Mathematics'], // Achievements for Archery's second effect
        decks: {
          base: {
            1: [
              'Pottery',   // dennis Draw.draw a card
              'Tools',     // dennis Archery super-execute (owner draws)
              'Clothing',  // micah Archery super-execute (demanded opponent draws)
            ],
            3: ['Paper'],  // micah Agriculture super-execute
            11: ['Hypersonics'], // micah Draw.draw a card
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Archery') // Dogma Archery (red) instead of Konstantin Novoselov
      // Karma triggers: super-execute each top card in order (red, blue, green, yellow, purple)
      // Super-execute Archery (red) - draws a {1}, demands transfer, junks achievement
      request = t.choose(game, request, 'Tools') // Card drawn by Archery's super-execution
      request = t.choose(game, request, '**base-1*') // Achievement choice from Archery's second effect
      // Super-execute Konstantin Novoselov (blue) - no dogma, skip
      // Super-execute Agriculture (yellow) - returns card, draws and scores one higher
      // At this point, micah has Tools, Philosophy, Hypersonics in hand
      request = t.choose(game, request, 'Philosophy') // Card to return from Agriculture's super-execution

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          red: ['Archery'],
          blue: ['Konstantin Novoselov'],
          yellow: ['Agriculture'],
          hand: ['Hypersonics', 'Tools'], // Philosophy was returned by Agriculture
          score: ['Paper'], // Paper scored by Agriculture's super-execution
        },
        junk: ['The Wheel'], // Achievement junked by Archery's second effect
      })
    })

    test('green: Sailing', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          red: ['Archery'], // Added red card to dogma instead of Konstantin Novoselov
          blue: ['Konstantin Novoselov'],
          green: ['Sailing'],
        },
        achievements: ['The Wheel', 'Mathematics'], // Achievements for Archery's second effect
        decks: {
          base: {
            1: [
              'Pottery',   // dennis Draw.draw a card
              'Clothing',  // dennis Archery super-execute (owner draws)
              'Tools',     // micah Sailing super-execute
            ],
            11: ['Hypersonics'], // micah Draw.draw a card
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Archery') // Dogma Archery (red) instead of Konstantin Novoselov
      // Karma triggers: super-execute each top card in order (red, blue, green, yellow, purple)
      // Super-execute Archery (red) - draws a {1}, demands transfer, junks achievement
      request = t.choose(game, request, 'Clothing') // Card drawn by Archery's super-execution (owner)
      request = t.choose(game, request, '**base-1*') // Achievement choice from Archery's second effect
      // Super-execute Konstantin Novoselov (blue) - no dogma, skip
      // Super-execute Sailing (green) - draws and melds a {1} (auto-melds, no choice needed)

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'], // Clothing was drawn by micah (demanded), not dennis
        },
        micah: {
          red: ['Archery'],
          blue: ['Tools', 'Konstantin Novoselov'], // Tools (blue) melded by Sailing's super-execution
          green: ['Sailing'],
          hand: ['Hypersonics', 'Clothing'], // Clothing drawn by Archery's super-execution (demanded)
        },
        junk: ['The Wheel'], // Achievement junked by Archery's second effect
      })
    })

    test('purple: Code of Laws super-executed', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          red: ['Archery'], // Added red card to dogma instead of Konstantin Novoselov
          blue: ['Konstantin Novoselov'], // Owner of karma card
          purple: ['Code of Laws'], // Top purple card
          hand: ['Philosophy'], // Purple card to tuck
        },
        achievements: ['The Wheel', 'Machinery'], // Achievements for Archery's second effect
        decks: {
          base: {
            1: [
              'Pottery',   // dennis Draw.draw a card
              'Tools',     // dennis Archery super-execute (owner draws)
            ],
            11: ['Hypersonics'], // micah Draw.draw a card
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Archery') // Dogma Archery (red) instead of Konstantin Novoselov
      // Karma triggers: super-execute each top card in order (red, blue, green, yellow, purple)
      // Super-execute Archery (red) - draws a {1}, demands transfer, junks achievement
      request = t.choose(game, request, 'Tools') // Card drawn by Archery's super-execution (owner)
      // Achievement choice from Archery's second effect is auto-selected (only one valid choice)
      // Super-execute Konstantin Novoselov (blue) - no dogma, skip
      // Super-execute Code of Laws (purple) - tuck and splay
      // At this point, micah has Tools and Philosophy in hand (Tools was drawn by demand, Philosophy was in hand)
      request = t.choose(game, request, 'Philosophy') // Card to tuck from Code of Laws' super-execution
      request = t.choose(game, request, 'purple') // Color to splay from Code of Laws' super-execution

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'], // Tools was drawn by micah (demanded), not dennis
        },
        micah: {
          red: ['Archery'],
          blue: ['Konstantin Novoselov'],
          purple: {
            cards: ['Code of Laws', 'Philosophy'], // Philosophy tucked by Code of Laws' super-execution
            splay: 'left',
          },
          hand: ['Hypersonics', 'Tools'], // Tools drawn by Archery's super-execution (demanded)
        },
        junk: ['The Wheel'], // Achievement junked by Archery's second effect
      })
    })

    test('all colors', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          red: ['Archery'],
          yellow: ['Agriculture'],
          green: ['Sailing'],
          blue: ['Konstantin Novoselov'],
          purple: ['Code of Laws'],
          hand: ['Philosophy', 'Mathematics'],
        },
        decks: {
          base: {
            1: ['Pottery', 'Tools', 'Clothing'],
            3: ['Paper'],
            11: ['Hypersonics'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Archery')
      request = t.choose(game, request, 'Tools') // Archery
      // Sailing
      request = t.choose(game, request, 'Mathematics') // Agriculture
      request = t.choose(game, request, 'Philosophy') // Code of Laws
      request = t.choose(game, request, 'purple') // Code of Laws



      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          red: ['Archery'],
          yellow: ['Agriculture'],
          green: ['Clothing', 'Sailing'],
          blue: ['Konstantin Novoselov'],
          purple: {
            cards: ['Code of Laws', 'Philosophy'], // Code of Laws was NOT dogmatized (would-instead prevented it)
            splay: 'left',
          },
          hand: ['Hypersonics', 'Tools'],
          score: ['Paper'],
        },
      })
    })

  })
})
