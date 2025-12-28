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
    // Archery's dogma executes normally: "I demand you draw a {1}, then transfer the highest card in your hand to my hand!"
    // dennis (owner) draws Tools, transfers highest (Tools) to himself (no change)
    // micah (opponent, demanded) draws nothing (no cards left), transfers highest (Gunpowder) to dennis
    // "Junk an available achievement of value 1 or 2."
    // Junk Philosophy achievement (age 2)

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
        },
        decks: {
          base: {
            1: ['Pottery', 'Clothing'],
            2: ['Mathematics'],
            11: ['Hypersonics'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Konstantin Novoselov')
      request = t.choose(game, request, 'Clothing')

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          red: ['Archery'],
          blue: ['Konstantin Novoselov'],
          hand: ['Hypersonics', 'Clothing'],
        },
      })
    })

    test('yellow: Agriculture', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          blue: ['Konstantin Novoselov'],
          yellow: ['Agriculture'],
          hand: ['Philosophy'],
        },
        decks: {
          base: {
            1: ['Pottery'],
            3: ['Paper'],
            11: ['Hypersonics'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Konstantin Novoselov')
      request = t.choose(game, request, 'Philosophy')

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          blue: ['Konstantin Novoselov'],
          yellow: ['Agriculture'],
          hand: ['Hypersonics'],
          score: ['Paper'],
        },
      })
    })

    test('green: Sailing', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          blue: ['Konstantin Novoselov'],
          green: ['Sailing'],
        },
        decks: {
          base: {
            1: ['Pottery', 'Clothing'],
            11: ['Hypersonics'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Konstantin Novoselov')

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          blue: ['Konstantin Novoselov'],
          green: ['Clothing', 'Sailing'],
          hand: ['Hypersonics'],
        },
      })
    })

    test('purple: Code of Laws super-executed', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
      t.setBoard(game, {
        micah: {
          blue: ['Konstantin Novoselov'], // Owner of karma card
          purple: ['Code of Laws'], // Top purple card
          hand: ['Philosophy'], // Purple card to tuck (same color as Code of Laws on dennis's board)
        },
        decks: {
          base: {
            1: ['Pottery'],
            2: ['Mathematics'],
            11: ['Hypersonics'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Draw.draw a card')
      request = t.choose(game, request, 'Dogma.Konstantin Novoselov')

      // Karma triggers: instead of dogmatizing Code of Laws, super-execute Code of Laws (purple)
      // Code of Laws' effect: "You may tuck a card from your hand of the same color as any card on your board. If you do, you may splay that color of your cards left."
      // dennis (owner) may tuck a card (no cards in hand, so no effect)
      // micah (opponent, demanded) may tuck a card - tucks Philosophy (purple, same color as dennis's Code of Laws)
      request = t.choose(game, request, 'Philosophy')
      // micah may splay purple left (but has no purple cards on board, so no effect)
      // Note: Code of Laws' original dogma does NOT execute (would-instead prevented it)
      request = t.choose(game, request, 'purple')

      t.testBoard(game, {
        dennis: {
          hand: ['Pottery'],
        },
        micah: {
          blue: ['Konstantin Novoselov'],
          purple: {
            cards: ['Code of Laws', 'Philosophy'], // Code of Laws was NOT dogmatized (would-instead prevented it)
            splay: 'left',
          },
          hand: ['Hypersonics'],
        },
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
      request = t.choose(game, request, 'Dogma.Konstantin Novoselov')
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
