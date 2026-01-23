Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Therese Kirongozi', () => {
  test('karma: opponent would dogma, draw/reveal/return card, super-execute top card of that color', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Card to dogma (but karma will replace it)
        green: ['Sailing'], // Top green card to super-execute
      },
      micah: {
        yellow: ['Therese Kirongozi'], // Owner of karma card
      },
      decks: {
        base: {
          1: ['The Wheel', 'Oars'], // The Wheel to draw/reveal/return (green, age 1), Oars drawn by micah's super-execute, Mathematics drawn by dennis's demand
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // Karma triggers (triggerAll: true, would-instead): dennis would dogma, but karma replaces it
    // Opponent (dennis) draws, reveals, and returns a card of any value
    request = t.choose(game, 1) // Choose age 1
    // The Wheel (green, age 1) is drawn, revealed, and returned
    // Opponent (dennis) super-executes their top card of the revealed card's color (green)
    // Sailing (green) is super-executed by dennis (the player who tried to dogma)
    // Sailing's dogma: "Draw and meld a {1}" - dennis executes it (super-execute), and all opponents (micah) are demanded
    // dennis draws and melds a {1} (Oars)
    // micah is demanded to draw and meld a {1}

    // After karma completes, micah's first action is done, so it's micah's second action
    t.testBoard(game, {
      dennis: {
        red: ['Oars', 'Archery'],
        green: ['Sailing'],
      },
      micah: {
        yellow: ['Therese Kirongozi'],
      },
    })
  })

  test('karma: opponent would dogma, draw/reveal/return card, no top card of that color, no super-execute', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        red: ['Archery'], // Card to dogma (but karma will replace it)
        // No blue cards on dennis's board
      },
      micah: {
        yellow: ['Therese Kirongozi'], // Owner of karma card
      },
      decks: {
        base: {
          1: ['Code of Laws'], // Card to draw/reveal/return (blue, age 1)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // Karma triggers (triggerAll: true, would-instead): dennis would dogma, but karma replaces it
    // Opponent (dennis) draws, reveals, and returns a card of any value
    request = t.choose(game, 1) // Choose age 1
    // Code of Laws (blue, age 1) is drawn, revealed, and returned
    // Opponent (dennis) has no top card of blue color, so no super-execute
    t.testBoard(game, {
      dennis: {
        red: ['Archery'], // Archery was NOT dogmatized (would-instead prevented it)
      },
      micah: {
        yellow: ['Therese Kirongozi'],
      },
    })
  })

  test('karma: owner dogmas, karma does not trigger', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        yellow: ['Therese Kirongozi'], // Owner of karma card
        red: ['Archery'], // Card to dogma
      },
      decks: {
        base: {
          1: ['Metalworking'], // Card drawn by Archery's dogma effect
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Archery')
    // Karma does NOT trigger (owner dogmas, not opponent)
    // Archery's dogma executes normally: "Draw a {1}"
    t.testBoard(game, {
      dennis: {
        yellow: ['Therese Kirongozi'],
        red: ['Archery'], // Archery was dogmatized normally
        hand: ['Metalworking'], // Metalworking drawn by Archery's dogma effect
      },
    })
  })
})
