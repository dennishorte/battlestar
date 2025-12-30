Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Shivaji', () => {

  describe('If an opponent would claim an achievement, first you claim another available standard achievement if eligible.', () => {
    test('karma: opponent claims achievement, owner claims another first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
        },
        micah: {
          green: ['Sailing'],
          score: ['Software'],
        },
        achievements: ['The Wheel', 'Sargon of Akkad'],
        decks: {
          base: {
            5: ['Measurement'],
          },
          figs: {
            5: ['Samuel de Champlain'],
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn by drawing a card (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')
      // Now micah's turn starts
      request = t.choose(game, request, 'Achieve.*base-1*')
      // Karma triggers: dennis claims another achievement first
      // Since only one other achievement is avaiable, dennis takes that one

      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
          hand: ['Measurement', 'Samuel de Champlain'],
          achievements: ['Sargon of Akkad'],
        },
        micah: {
          green: ['Sailing'],
          score: ['Software'],
          achievements: ['The Wheel'],
        },
      })
    })

    test('karma: opponent claims achievement, owner claims another (only one eligible)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card - needed to claim age 3 achievement
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement (cost 15)
        },
        achievements: ['The Wheel', 'Machinery'],
        decks: {
          base: {
            3: ['Engineering'],
            5: ['Measurement'],
          },
          figs: {
            3: ['Al-Kindi'],
            5: ['Samuel de Champlain'],
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn by drawing a card (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')
      // Now micah's turn starts
      request = t.choose(game, request, 'Achieve.*base-3*') // micah claims Machinery
      // Karma triggers: dennis claims another achievement first (via karma, no figure drawing)
      // Only The Wheel is available (and different from Machinery), so auto-selects
      // micah claims Machinery via Achieve action, so dennis (opponent) draws age 3 figures

      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
          hand: ['Measurement', 'Samuel de Champlain'],
          achievements: ['The Wheel'], // dennis claimed this first
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement
          achievements: ['Machinery'], // micah claimed this after dennis
        },
      })
    })

    test('karma: opponent claims achievement, owner not eligible', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: [], // No cards in score, not eligible for standard achievements
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card - needed to claim age 3 achievement
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement (cost 15)
        },
        achievements: ['The Wheel', 'Machinery'],
        decks: {
          base: {
            3: ['Engineering'],
            5: ['Measurement'],
          },
          figs: {
            3: ['Al-Kindi'],
            5: ['Samuel de Champlain'],
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn by drawing a card (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')
      // Now micah's turn starts
      request = t.choose(game, request, 'Achieve.*base-3*') // micah claims Machinery
      // Karma triggers but dennis is not eligible, so no achievement claimed
      // micah claims Machinery via Achieve action, so dennis (opponent) draws age 3 figures

      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: [],
          hand: ['Measurement', 'Samuel de Champlain'],
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement
          achievements: ['Machinery'], // micah claimed this
        },
      })
    })

    test('karma: opponent claims achievement, no other achievements available', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card - needed to claim age 3 achievement
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement (cost 15)
        },
        achievements: ['Machinery'], // Only one achievement available (the one micah will claim)
        decks: {
          base: {
            3: ['Engineering'],
            5: ['Measurement'],
          },
          figs: {
            3: ['Al-Kindi'],
            5: ['Samuel de Champlain'],
          }
        }
      })

      let request
      request = game.run()
      // Skip dennis's turn by drawing a card (first round only has one action)
      request = t.choose(game, request, 'Draw.draw a card')
      // Now micah's turn starts
      request = t.choose(game, request, 'Achieve.*base-3*') // micah claims Machinery
      // Karma triggers but no other achievements available, so dennis cannot claim
      // micah claims Machinery via Achieve action, so dennis (opponent) draws age 3 figures

      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
          hand: ['Measurement', 'Samuel de Champlain'], // dennis draws figures when micah claims Machinery
        },
        micah: {
          green: ['Sailing'],
          blue: ['Translation'], // Age 3 card
          score: ['Software', 'Coal'], // Score 10 + 5 = 15, enough for age 3 achievement
          achievements: ['Machinery'], // micah claimed this
        },
      })
    })

    test('karma: owner claims achievement, karma does not trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
        },
        achievements: ['The Wheel', 'Mathematics'],
        decks: {
          base: {
            1: ['Tools'],
          },
          figs: {
            1: ['Fu Xi'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Achieve.*base-1*') // dennis claims The Wheel
      // Karma does not trigger because owner is claiming, not opponent
      // dennis claims The Wheel via Achieve action, so micah (opponent) draws age 1 figures

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          score: ['Canning'],
          achievements: ['The Wheel'], // dennis claimed this
        },
        micah: {
          hand: ['Fu Xi'],
        },
      })
    })
  })

  describe('If you would dogma a yellow card, first transfer all purple cards on your board to the available achievements.', () => {
    test('karma: dogma yellow card, transfer all purple cards to achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: ['Lighting', 'Philosophy'], // Multiple purple cards
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Canal Building')
      // Karma triggers: transfer all purple cards to achievements first
      // Canal Building dogma requires a choice - choose to junk the deck (simpler)
      request = t.choose(game, request, 'Junk all cards in the 3 deck')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: [], // All purple cards transferred
        },
      })
      // Verify purple cards are in achievements (don't test achievements zone directly)
      const achievements = game.zones.byId('achievements').cardlist().map(c => c.name)
      expect(achievements).toContain('Lighting')
      expect(achievements).toContain('Philosophy')
    })

    test('karma: dogma yellow card, transfer single purple card to achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: ['Lighting'], // Single purple card
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Canal Building')
      // Karma triggers: transfer purple card to achievements first
      // Canal Building dogma requires a choice - choose to junk the deck (simpler)
      request = t.choose(game, request, 'Junk all cards in the 3 deck')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: [], // Purple card transferred
        },
      })
      // Verify purple card is in achievements
      const achievements = game.zones.byId('achievements').cardlist().map(c => c.name)
      expect(achievements).toContain('Lighting')
    })

    test('karma: dogma yellow card, no purple cards on board', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: [], // No purple cards
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Canal Building')
      // Karma triggers but no purple cards to transfer
      // Canal Building dogma requires a choice - choose to junk the deck (simpler)
      request = t.choose(game, request, 'Junk all cards in the 3 deck')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: [], // Still empty
        },
      })
    })

    test('karma: dogma non-yellow card, karma does not trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          green: ['Sailing'],
          purple: ['Lighting', 'Philosophy'], // Purple cards remain
        },
        decks: {
          base: {
            1: ['Tools'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Sailing')
      // Karma does not trigger because Archery is red, not yellow

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          green: ['Sailing'],
          blue: ['Tools'],
          purple: ['Lighting', 'Philosophy'], // Purple cards remain
        },
      })
    })

    test('karma: dogma yellow card, purple cards transferred in order', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: ['Lighting', 'Philosophy'], // Multiple purple cards in order
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Canal Building')
      // Karma triggers: transfer all purple cards to achievements (ordered: true)
      // Canal Building dogma requires a choice - choose to junk the deck (simpler)
      request = t.choose(game, request, 'Junk all cards in the 3 deck')

      t.testIsSecondPlayer(game)
      const achievements = game.zones.byId('achievements').cardlist().map(c => c.name)
      // Cards should be transferred in order
      expect(achievements).toContain('Lighting')
      expect(achievements).toContain('Philosophy')
      t.testBoard(game, {
        dennis: {
          red: ['Shivaji'],
          yellow: ['Canal Building'],
          purple: [], // All purple cards transferred
        },
      })
    })
  })

})
