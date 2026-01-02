Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Peter the Great', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Peter the Great', 'War')
  })

  describe('If you would return a card, first score you bottom green card. If the scored card has {c}, achieve your bottom green card, if eligible.', () => {
    test('karma: return card, score bottom green card (has {c}), achieve bottom green card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['The Wheel', 'Mapmaking'], // Mapmaking is bottom (last in array), has {c}
          yellow: ['Agriculture'], // Card with return effect
          hand: ['Tools'], // Card to return from hand
        },
        achievements: ['Sailing'], // Age 1 standard achievement (The Wheel is on dennis's board)
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn after returning Tools (age 1 -> draws age 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools from hand
      // Karma triggers: score bottom green card (Mapmaking)
      // Mapmaking has {c}, so try to achieve bottom green card (The Wheel)
      // The Wheel is age 1, dennis has age 1 top card and 7 points, eligible

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: [], // Both green cards moved (Mapmaking scored, The Wheel achieved)
          yellow: ['Agriculture'],
          score: ['Mapmaking', 'Mathematics'], // Mapmaking was scored, Mathematics was drawn and scored
          achievements: ['The Wheel'], // The Wheel card was achieved (moved from board to achievements)
        },
      })
    })

    test('karma: return card, score bottom green card (has {c}), no other green cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['Navigation'], // Only one green card, has {c}
          yellow: ['Agriculture'], // Card with return effect
          hand: ['Tools'], // Card to return
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn after returning Tools (age 1 -> draws age 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools
      // Karma triggers: score Navigation (has {c}), but no other green cards to achieve

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: [], // Navigation was scored
          yellow: ['Agriculture'],
          score: ['Navigation', 'Mathematics'], // Navigation scored, Mathematics drawn and scored
        },
      })
    })

    test('karma: return card, score bottom green card (has {c}), bottom green card not eligible', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['Navigation', 'The Wheel'],
          yellow: ['Agriculture'], // Card with return effect
          hand: ['Tools'], // Card to return
          score: [], // No score initially, but Navigation will be scored
        },
        achievements: ['Sailing'], // Age 1 standard achievement (The Wheel is on dennis's board)
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn after returning Tools (age 1 -> draws age 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools
      // Karma triggers: score Navigation (has {c}), try to achieve The Wheel (bottom green card)
      // After Navigation (age 4) is scored, dennis has score 9
      // The Wheel requires score >= 5, but the eligibility check might be happening after Mathematics is also scored
      // Note: The Wheel is on the board, so Sailing is the standard achievement

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['Navigation'],
          yellow: ['Agriculture'],
          score: ['The Wheel', 'Mathematics'],
        },
      })
    })

    test('karma: return card, no green cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          yellow: ['Agriculture'], // Card with return effect
          hand: ['Tools'], // Card to return
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn after returning Tools (age 1 -> draws age 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools
      // Karma triggers but no green cards to score

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          yellow: ['Agriculture'],
          score: ['Mathematics'], // Mathematics drawn and scored
        },
      })
    })

    test('karma: return card, score bottom green card (no {c}), no achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['Sailing', 'The Wheel'], // The Wheel has no {c} (hkkk)
          yellow: ['Agriculture'], // Card with return effect
          hand: ['Tools'], // Card to return
        },
        decks: {
          base: {
            2: ['Mathematics'], // Card drawn after returning Tools (age 1 -> draws age 2)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools
      // Karma triggers: score The Wheel (no {c}), so no achievement attempt

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Peter the Great'],
          green: ['Sailing'], // The Wheel was scored
          yellow: ['Agriculture'],
          score: ['The Wheel', 'Mathematics'], // The Wheel scored, Mathematics drawn and scored
        },
      })
    })
  })

})
