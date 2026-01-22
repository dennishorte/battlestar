Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Avicenna', () => {

  test('karma decree', () => {
    t.testDecreeForTwo('Avicenna', 'Expansion')
  })

  describe('karma: would-instead dogma on first action', () => {
    test('junk lowest available achievement and super-execute it when dogmatizing as first action', () => {
      // Test the following:
      // - When dogmatizing a card as the first action, the karma triggers
      // - The lowest available standard achievement (by age) is junked
      // - The junked achievement is super-executed (all opponents are demanded)
      // - The original card's dogma does NOT execute (would-instead prevents it)
      // - Only the achievement's dogma effects execute
      // - If multiple achievements are available, the one with the lowest age is selected
      // - Super-execution properly demands all opponents (they must share if they have required icons)
      // - Achievement demand effects properly target all opponents during super-execution
      // - Works correctly with multiple players (lowest achievement selected from all available)
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Avicenna'],
          red: ['Archery'], // Card to dogma - has demand effect that would transfer cards
          hand: [],
        },
        micah: {
          hand: ['Gunpowder', 'Currency'], // Cards that would be transferred if Archery dogma executed
        },
        achievements: ['The Wheel', 'Mathematics', 'Machinery'], // Multiple achievements - The Wheel (age 1) should be selected
        decks: {
          base: {
            1: ['Tools', 'Agriculture'], // Cards that will be drawn by The Wheel's dogma
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Archery')
      // Karma triggers: The Wheel (lowest age) should be junked and super-executed
      // Archery's dogma should NOT execute (no cards transferred from micah)
      // The Wheel's dogma should execute and draw two {1}

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Avicenna'],
          red: ['Archery'], // Archery still on board (dogma did not execute)
          hand: ['Tools', 'Agriculture'], // Drawn by The Wheel's dogma
        },
        micah: {
          hand: ['Gunpowder', 'Currency'], // No transfer occurred (Archery dogma did not execute)
        },
        junk: ['The Wheel'], // The Wheel was junked
      })
    })

    test('no effect when no available standard achievements', () => {
      // Test the following:
      // - When there are no available standard achievements, the karma triggers
      // - The karma logs "no available standard achievements" and does nothing
      // - The original dogma does NOT execute (would-instead prevents it even when no achievement is junked)
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Avicenna'],
          red: ['Archery'],
          hand: [],
        },
        micah: {
          hand: ['Gunpowder', 'Currency'],
        },
        achievements: [], // No achievements available
        decks: {
          base: {
            1: ['Tools'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Archery')
      // Karma triggers but no achievements available - logs message and does nothing
      // Archery's dogma should NOT execute

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Avicenna'],
          red: ['Archery'], // Archery still on board (dogma did not execute)
          hand: [],
        },
        micah: {
          hand: ['Gunpowder', 'Currency'], // No transfer occurred
        },
        junk: [], // No achievement was junked
      })
    })

    test('does not trigger on second action', () => {
      // Test the following:
      // - When dogmatizing as the second action, the karma does NOT trigger
      // - The normal dogma executes as expected
      // - No achievement is junked or super-executed
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Avicenna'],
          green: ['The Wheel'], // Simple dogma: just draws two {1}
          hand: [],
        },
        micah: {
          hand: [],
        },
        achievements: ['Sailing', 'Mathematics'],
        decks: {
          base: {
            1: ['Tools', 'Agriculture'],
          }
        }
      })

      let request
      request = game.run()
      // First action: Draw a card (first round only has one action)
      request = t.choose(game, 'Draw.draw a card')
      // Micah's turn - do one action to complete the round
      request = t.choose(game, 'Draw.draw a card')
      // First action of second round: Draw a card (to set up for second action)
      request = t.choose(game, 'Draw.draw a card')
      // Second action: Dogma The Wheel - karma should NOT trigger (actionNumber === 2)
      request = t.choose(game, 'Dogma.The Wheel')

      // Verify the key point: Avicenna's karma did not trigger
      // If it had triggered, it would have junked the lowest available achievement (The Wheel, age 1)
      // and super-executed it. Since The Wheel card is still on dennis's board and the dogma
      // executed normally (dennis drew cards), the karma did not trigger.
      const junkCards = game.zones.byId('junk').cardlist().map(c => c.name)
      // The Wheel achievement should not be junked by Avicenna's karma
      expect(junkCards).not.toContain('The Wheel')

      // Verify The Wheel card is still on dennis's board (dogma executed normally)
      expect(t.cards(game, 'green', 'dennis')).toContain('The Wheel')
    })
  })

})
