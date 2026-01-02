Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Wernher Von Braun', () => {
  test('karma: player draws figure, junk age 9 deck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Computers'], // Score to meet achievement requirement
      },
      micah: {
        blue: ['Wernher Von Braun'], // Owner of karma card
      },
      achievements: ['Tools'],
      decks: {
        figs: {
          10: ['Susan Blackmore'], // Figure that micah will draw when dennis claims achievement
        },
      },
    })

    let request
    request = game.run()
    // dennis (owner) claims an achievement
    request = t.choose(game, request, 'Achieve.*base-1*')
    // When dennis claims achievement, micah (opponent) draws a figure
    // Karma triggers: first junk all cards in {9} or {0} deck
    // Owner (dennis) chooses which deck to junk
    request = t.choose(game, request, 9) // Choose to junk age 9 deck
    // Then figure is drawn for micah

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Computers'], // Score to meet achievement requirement
        achievements: ['Tools'],
      },
      micah: {
        blue: ['Wernher Von Braun'],
        hand: ['Susan Blackmore'], // Figure was drawn when dennis claimed achievement
        score: [
          "Collaboration",
          "Composites",
          "Ecology",
          "Fission",
          "Genetics",
          "Satellites",
          "Services",
          "Specialization",
          "Suburbia",
        ],
      },
    })
    t.testDeckIsJunked(game, 9)
  })

  test('karma: player draws figure, junk age 10 deck', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Computers'], // Score to meet achievement requirement
      },
      micah: {
        blue: ['Wernher Von Braun'], // Owner of karma card
      },
      achievements: ['Tools'],
      decks: {
        figs: {
          9: ['Hedy Lamar'],
          10: ['Susan Blackmore'], // Figure that micah will draw when dennis claims achievement
        },
      },
    })

    let request
    request = game.run()
    // dennis claims an achievement
    request = t.choose(game, request, 'Achieve.*base-1*')
    // When dennis claims achievement, micah (opponent) draws a figure
    // Karma triggers: first junk all cards in {9} or {0} deck
    // Owner (micah) chooses which deck to junk
    request = t.choose(game, request, 10) // Choose to junk age 10 deck
    // Then figure is drawn for micah

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Sailing'],
        score: ['Computers'],
        achievements: ['Tools'],
      },
      micah: {
        blue: ['Wernher Von Braun'],
        hand: ['Hedy Lamar'], // Figure was drawn when dennis claimed achievement (age 10 figure)
        score: [
          "A.I.",
          "Bioengineering",
          "Databases",
          "Globalization",
          "Miniaturization",
          "Robotics",
          "Self Service",
          "Software",
          "Stem Cells",
          "The Internet",
        ],
      },
    })
    t.testDeckIsJunked(game, 10)
  })

})
