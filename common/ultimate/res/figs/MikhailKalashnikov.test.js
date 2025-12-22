Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Mikhail Kalashnikov', () => {
  describe('If an opponent would meld a card, first choose a top red card on an opponent\'s board. Choose to either score it, or self-execute it.', () => {
    test('karma: opponent melds, choose to score top red card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Archery'], // Top red card on dennis's board
          hand: ['Tools'], // Card to meld
        },
        micah: {
          red: ['Mikhail Kalashnikov'], // Owner of karma card
        },
      })

      let request
      request = game.run()
      // dennis (opponent) melds Tools
      request = t.choose(game, request, 'Meld.Tools')
      // Karma triggers: micah (owner) chooses a top red card on opponent's board
      // Only Archery is available (dennis's top red card)
      request = t.choose(game, request, 'score.Archery')
      // Archery is scored

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: [], // Archery was scored (removed from dennis's board)
          blue: ['Tools'], // Tools was melded
        },
        micah: {
          red: ['Mikhail Kalashnikov'],
          score: ['Archery'], // Archery was scored to micah's score pile (owner of karma)
        },
      })
    })

    test('karma: opponent melds, choose to self-execute top red card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Metalworking'], // Top red card on dennis's board
          hand: ['Tools'], // Card to meld
        },
        micah: {
          red: ['Mikhail Kalashnikov'], // Owner of karma card
        },
        decks: {
          base: {
            1: ['Sailing'], // Card drawn by Metalworking's dogma
          },
        },
      })

      let request
      request = game.run()
      // dennis (opponent) melds Tools
      request = t.choose(game, request, 'Meld.Tools')
      // Karma triggers: micah (owner) chooses a top red card on opponent's board
      // Only Metalworking is available (dennis's top red card)
      request = t.choose(game, request, 'self-execute.Metalworking')
      // Metalworking is self-executed: "Draw a {1}."
      // micah (owner) draws Sailing

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Metalworking'], // Metalworking remains (was self-executed, not removed)
          blue: ['Tools'], // Tools was melded
        },
        micah: {
          red: ['Mikhail Kalashnikov'],
          hand: ['Sailing'], // Sailing drawn by Metalworking's dogma (self-executed for micah)
        },
      })
    })

    test('karma: opponent melds, no opponent has top red card', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          blue: ['Tools'], // No red card on dennis's board
          hand: ['Sailing'], // Card to meld
        },
        micah: {
          red: ['Mikhail Kalashnikov'], // Owner of karma card
        },
      })

      let request
      request = game.run()
      // dennis (opponent) melds Sailing
      request = t.choose(game, request, 'Meld.Sailing')
      // Karma triggers but no opponent has a top red card, so nothing happens

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          blue: ['Tools'],
          green: ['Sailing'], // Sailing was melded (Sailing is green)
        },
        micah: {
          red: ['Mikhail Kalashnikov'],
        },
      })
    })

    test('karma: owner melds, karma does not trigger', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          red: ['Mikhail Kalashnikov'], // Owner of karma card
          hand: ['Tools'], // Card to meld
        },
        micah: {
          red: ['Archery'], // Top red card on micah's board (should not be affected)
        },
      })

      let request
      request = game.run()
      // dennis (owner) melds Tools - karma should NOT trigger
      request = t.choose(game, request, 'Meld.Tools')
      // No karma trigger, meld proceeds normally

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          red: ['Mikhail Kalashnikov'],
          blue: ['Tools'], // Tools was melded normally
        },
        micah: {
          red: ['Archery'], // Archery remains untouched (karma did not trigger)
        },
      })
    })
  })
})
