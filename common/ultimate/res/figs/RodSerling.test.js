Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Rod Serling', () => {

  describe('transfer action', () => {
    test('karma: transfer card age < 4, player loses', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Near-Field Comm'], // Has demand effect to transfer from score pile
        },
        micah: {
          purple: ['Rod Serling'], // Karma on micah's board
          score: ['Tools'], // Age 1 card to be transferred (age < 4)
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Near-Field Comm')
      request = t.choose(game, request, 1) // Choose age 1 (Tools is age 1)
      // Near-Field Comm demands: transfer all cards of chosen age from score pile
      // micah transfers Tools (age 1, < 4)
      // Karma triggers: micah loses

      t.testGameOver(request, 'dennis', 'Rod Serling')
      t.testBoard(game, {
        dennis: {
          yellow: ['Near-Field Comm'],
        },
        micah: {
          purple: ['Rod Serling'],
          score: ['Tools'], // Not transferred (micah lost)
        },
      })
    })

    test('karma: transfer card age >= 4, proceeds normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Near-Field Comm'], // Has demand effect to transfer from score pile
        },
        micah: {
          purple: ['Rod Serling'], // Karma on micah's board
          score: ['Gunpowder'], // Age 4 card to be transferred (age >= 4)
        },
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Near-Field Comm')
      request = t.choose(game, request, 4) // Choose age 4 (Gunpowder is age 4)
      // Near-Field Comm demands: transfer all cards of chosen age from score pile
      // micah transfers Gunpowder (age 4, >= 4)
      // Karma does NOT trigger

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Near-Field Comm'],
          score: ['Gunpowder'], // Transferred normally
        },
        micah: {
          purple: ['Rod Serling'],
          score: [],
        },
      })
    })
  })

  describe('score action', () => {
    test('karma: score card age < 4, player loses', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Tools'], // Age 1 card to return for Agriculture
        },
        decks: {
          base: {
            2: ['Mathematics'], // Age 2 card to be scored (age < 4)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools to score age 2
      // Agriculture scores Mathematics (age 2, < 4)
      // Karma triggers: dennis loses

      t.testGameOver(request, 'micah', 'Rod Serling')
      t.testBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          yellow: ['Agriculture'],
          hand: ['Tools'], // Not returned/scored (dennis lost)
        },
      })
    })

    test('karma: score card age >= 4, proceeds normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Gunpowder'], // Age 4 card to return for Agriculture
        },
        decks: {
          base: {
            5: ['Chemistry'], // Age 5 card to be scored (age >= 4)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Gunpowder') // Return Gunpowder (age 4, >= 4) to score age 5
      // Agriculture scores Chemistry (age 5, >= 4)
      // Karma does NOT trigger (neither return nor score triggers it)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          yellow: ['Agriculture'],
          score: ['Chemistry'], // Scored normally
          hand: [],
        },
      })
    })
  })

  describe('draw action', () => {
    test('karma: draw card age < 4, player loses', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          green: ['The Wheel'], // Card with dogma that draws age 1
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'], // Age 1 cards to be drawn (age < 4)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.The Wheel')
      // The Wheel's dogma: draw two {1}
      // dennis draws Tools and Sailing (age 1, < 4)
      // Karma triggers on first draw: dennis loses

      t.testGameOver(request, 'micah', 'Rod Serling')
      t.testBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          green: ['The Wheel'],
          hand: [], // Cards not drawn (dennis lost)
        },
      })
    })

    test('karma: draw card age >= 4, proceeds normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          red: ['Gunpowder'], // Age 4 top card
        },
        decks: {
          base: {
            4: ['Printing Press'], // Age 4 card to be drawn (age >= 4)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Draw.draw a card')
      // dennis has Rod Serling (age 9) and Gunpowder (age 4), so highest is 9
      // This will draw age 9, not age 4
      // We need to force age 4 draw

      // Let me use Gunpowder's dogma which draws age 2, but we need age 4
      // Actually, let's just accept that with Rod Serling on the board, it will draw age 9
      // But we can test that age 9 >= 4, so karma doesn't trigger

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          red: ['Gunpowder'],
          hand: ['Fission'], // Drawn age 9 (age >= 4, karma doesn't trigger)
        },
      })
    })
  })

  describe('triggerAll: opponent action', () => {
    test('karma: opponent scores card age < 4, opponent loses', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Rod Serling'], // Karma on dennis's board
        },
        micah: {
          yellow: ['Agriculture'], // Card with score effect
          hand: ['Tools'], // Age 1 card to return for Agriculture
        },
        decks: {
          base: {
            2: ['Mathematics'], // Age 2 card to be scored (age < 4)
          }
        }
      })

      let request
      request = game.run()
      // First player (dennis) gets one action, then turn advances to micah
      request = t.choose(game, request, 'Draw.draw a card')
      // Now it's micah's turn
      request = t.choose(game, request, 'Dogma.Agriculture')
      request = t.choose(game, request, 'Tools') // Return Tools to score age 2
      // Agriculture scores Mathematics (age 2, < 4)
      // Rod Serling's karma (on dennis's board) triggers: micah loses

      t.testGameOver(request, 'dennis', 'Rod Serling')
      t.testBoard(game, {
        dennis: {
          purple: ['Rod Serling'],
          hand: ['Fission'], // Drawn during first action (age 9, >= 4, so karma doesn't trigger)
        },
        micah: {
          yellow: ['Agriculture'],
          hand: ['Tools'], // Not returned/scored (micah lost)
        },
      })
    })
  })

})
