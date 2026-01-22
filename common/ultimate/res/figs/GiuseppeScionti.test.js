Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Giuseppe Scionti', () => {
  test('karma: dogma card, first draw and score a {9}, then execute dogma effect', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Giuseppe Scionti'], // Owner of karma card (age 11, so {9} = age 9)
        green: ['Sailing'], // Sailing's dogma: Draw and meld a {1}
      },
      decks: {
        base: {
          1: ['Agriculture'], // Card to meld by Sailing's dogma
          9: ['Services'], // Age 9 card to draw and score by karma
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')
    // Karma triggers: first draw and score a {9} (Services)
    // Then Sailing's dogma effect executes: draw and meld a {1} (Agriculture)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Giuseppe Scionti'],
        green: ['Sailing'],
        yellow: ['Agriculture'], // Agriculture melded by Sailing's dogma
        score: ['Services'], // Services drawn and scored by karma
      },
    })
  })

  test('karma: dogma card with multiple effects, karma triggers before each effect', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Giuseppe Scionti'], // Owner of karma card
        green: ['Clothing'], // Clothing has 2 dogma effects
        hand: ['Metalworking'], // Card to meld by first effect (different color from yellow, red card)
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel', 'Writing'], // Card for Clothing's second effect
          9: ['Services', 'Computers'], // Age 9 cards to draw and score by karma (one for each effect)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Clothing')
    // Karma triggers before first effect: draw and score a {9} (Services)
    // First effect executes: meld a card from hand of different color
    // Karma triggers before second effect: draw and score a {9} (Computers)
    // Second effect executes: draw and score a {1} for each unique color (1 color: green)
    // Draws Tools and scores it

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Giuseppe Scionti'],
        green: ['Clothing'],
        red: ['Metalworking'], // Metalworking melded by first effect (red card)
        score: ['Services', 'Computers', 'Tools', 'The Wheel', 'Writing'], // Services and Computers scored by karma, age 1 cards scored by clothing
      },
    })
  })

  test('karma: opponent dogmas, you share, karma triggers for each effect you execute', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        green: ['Sailing'], // Sailing has featured icon 'l', dennis will dogma it
      },
      micah: {
        blue: ['Giuseppe Scionti'], // Owner of karma card
        purple: ['Code of Laws'], // Code of Laws has 'c' icon (biscuits: hccl), so micah can share
      },
      decks: {
        base: {
          1: ['Tools', 'The Wheel'], // Cards for Sailing's effect
          9: ['Services'], // Age 9 card to draw and score by karma
        },
        figs: {
          1: ['Sargon of Akkad'],
        },
      }
    })

    let request
    request = game.run()
    // dennis is first player
    request = t.choose(game, 'Dogma.Sailing')
    // dennis dogmas Sailing, micah shares (has 'c' icon from Code of Laws)
    // Karma triggers before effect micah executes: draw and score a {9} (Services)
    // Effect executes for micah: draw and meld a {1} (The Wheel - auto-melded, no choice)

    t.testIsSecondPlayer(game)
    // Note: Currently, dogma-effect karma only triggers for the player taking the Dogma action,
    // not for players who share. This may be a limitation of the current implementation.
    // The karma should trigger for each actor who executes an effect, including when sharing.
    t.testBoard(game, {
      dennis: {
        green: ['The Wheel', 'Sailing'], // The Wheel drawn and melded by dennis's effect
        hand: ['Sargon of Akkad'], // Sharing bonus drawn
      },
      micah: {
        blue: ['Tools', 'Giuseppe Scionti'], // Tools drawn and melded by micah's effect (age 1, blue)
        purple: ['Code of Laws'], // Code of Laws remains
        score: ['Services'],
      },
    })
  })
})
