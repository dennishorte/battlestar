Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Yuna Kim', () => {
  test('karma: score card, top card has {k}, you win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Yuna Kim'],
        red: ['Metalworking'], // Metalworking has {k} (kkhk) - top red card
        blue: ['Pottery'], // Card with score effect
        hand: ['Gunpowder'], // Card to return
      },
      decks: {
        base: {
          1: ['Archery'], // Age 1 red card to draw and score
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pottery')
    request = t.choose(game, request, 'Gunpowder') // Return Gunpowder (1 card)
    // Pottery's first effect: return 1 card, then draw and score age 1
    // Draws and scores Archery (age 1, red)
    // Karma triggers: check if top red card (Metalworking) has {k}
    // Metalworking has {k}, so dennis wins

    t.testGameOver(request, 'dennis', 'Yuna Kim')
  })

  test('karma: score card, top card does not have {k}, score proceeds normally', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Yuna Kim'],
        red: ['Gunpowder'], // Gunpowder does not have {k} (hfcf) - top red card
        blue: ['Pottery'], // Card with score effect
        hand: ['Construction'], // Card to return
      },
      decks: {
        base: {
          1: ['Archery'], // Age 1 red card to draw and score
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Pottery')
    request = t.choose(game, request, 'Construction') // Return Construction (1 card)
    // Pottery's first effect: return 1 card, then draw and score age 1
    // Draws and scores Archery (age 1, red)
    // Karma triggers (would-first): check if top red card (Gunpowder) has {k}
    // Gunpowder does not have {k}, so karma does nothing and score proceeds normally
    // Archery is scored

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Yuna Kim'],
        red: ['Gunpowder'], // Top red card unchanged
        blue: ['Pottery'],
        score: ['Archery'], // Archery was scored normally (karma did nothing)
        hand: ['Metalworking'], // Metalworking drawn by Pottery's second effect
      },
    })
  })

  test('karma: owner melds card, return top 3 cards of that color from all boards, then tuck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Yuna Kim'], // Owner of karma card
        blue: ['Tools', 'Mathematics', 'Writing', 'Printing Press'], // 4 blue cards - top 3 will be returned
        hand: ['Experimentation'], // Blue card to meld
      },
      micah: {
        blue: ['Software', 'Computers'], // 2 blue cards - both will be returned (less than 3)
      },
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Experimentation')
    // Karma triggers: return top 3 blue cards from all boards
    // From dennis: Tools, Mathematics, Writing (top 3)
    // From micah: Software, Computers (both, less than 3)
    // returnMany will ask owner (dennis) to choose order of returning cards
    request = t.choose(game, request, 'auto') // Auto-order for returning cards
    // Then tuck Experimentation instead of melding it

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Yuna Kim'],
        blue: ['Printing Press', 'Experimentation'], // Experimentation was tucked (at bottom), Printing Press remains
        hand: [], // Cards were returned to deck, not hand
      },
      micah: {
        blue: [], // All blue cards returned to deck
      },
    })
  })

  test('karma: opponent melds card (triggerAll), return top 3 cards of that color from all boards, then tuck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Yuna Kim'], // Owner of karma card
        blue: ['Tools', 'Mathematics'], // 2 blue cards - both will be returned (less than 3)
      },
      micah: {
        blue: ['Writing', 'Printing Press', 'Experimentation', 'Computers'], // 4 blue cards - top 3 will be returned
        hand: ['Software'], // Blue card to meld
      },
    })

    let request
    request = game.run()
    // Skip dennis's turn (first action) - dennis takes one action
    request = t.choose(game, request, 'Draw.draw a card') // dennis draws
    // Now it's micah's turn
    request = t.choose(game, request, 'Meld.Software') // micah melds Software
    // Karma triggers (triggerAll: true): return top 3 blue cards from all boards
    // From dennis: Tools, Mathematics (both, less than 3)
    // From micah: Writing, Printing Press, Experimentation (top 3)
    // returnMany will ask owner (dennis) to choose order of returning cards
    request = t.choose(game, request, 'auto') // Auto-order for returning cards
    // Then tuck Software instead of melding it

    t.testBoard(game, {
      dennis: {
        purple: ['Yuna Kim'],
        blue: [], // All blue cards returned to deck
        hand: ['Robotics'], // Robotics drawn by dennis's Draw action
      },
      micah: {
        blue: ['Computers', 'Software'], // Software was tucked (at bottom), Computers remains
        hand: [], // Software was tucked, not in hand
      },
    })
  })

})
