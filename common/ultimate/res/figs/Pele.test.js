Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Pele', () => {
  test('karma: decree', () => {
    t.testDecreeForTwo('Pele', 'Rivalry')
  })

  test('karma: score card with matching top green and yellow as highest, win', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele'],        // Age 9
        green: ['Collaboration'], // Age 9
        yellow: ['Suburbia'],     // Age 9
        red: ['Archery'],         // Age 1 (lower than 9)
        blue: ['Pottery'],        // Age 1, to dogma and score
        hand: ['Tools', 'Writing'], // Age 1 cards to return for Pottery
      },
      decks: {
        base: {
          1: ['Domestication'],   // Age 1, will be drawn and scored by Pottery
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pottery')
    request = t.choose(game, 'Tools', 'Writing') // Return two cards
    request = t.choose(game, 'auto') // Confirm selection

    t.testGameOver(request, 'dennis', 'Pele')
    t.testBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Collaboration'],
        yellow: ['Suburbia'],
        red: ['Archery'],
        blue: ['Pottery'],
        hand: ['Mapmaking'], // Drawn by Pottery's second dogma effect (not scored because player won instead)
      },
    })
  })

  test('karma: score card without both green and yellow, proceeds normally', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Collaboration'], // Has green but no yellow
        red: ['Archery'],
        blue: ['Pottery'],        // Age 1, to dogma and score
        hand: ['Tools', 'Writing'], // Age 1 cards to return for Pottery
      },
      decks: {
        base: {
          1: ['Domestication'],   // Age 1, will be drawn and scored by Pottery
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pottery')
    request = t.choose(game, 'Tools', 'Writing') // Return two cards
    request = t.choose(game, 'auto') // Confirm selection

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Collaboration'],
        red: ['Archery'],
        blue: ['Pottery'],
        hand: ['Domestication'], // Drawn by Pottery's second dogma effect
        score: ['Mapmaking'], // Card scored normally (karma did not trigger)
      },
    })
  })

  test('karma: score card with different age top green and yellow, proceeds normally', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Databases'],        // Age 3
        yellow: ['Suburbia'],     // Age 9 (different from green)
        red: ['Archery'],
        blue: ['Pottery'],        // Age 1, to dogma and score
        hand: ['Tools', 'Writing'], // Age 1 cards to return for Pottery
      },
      decks: {
        base: {
          1: ['Domestication'],   // Age 1, will be drawn and scored by Pottery
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pottery')
    request = t.choose(game, 'Tools', 'Writing') // Return two cards
    request = t.choose(game, 'auto') // Confirm selection

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Databases'],
        yellow: ['Suburbia'],
        red: ['Archery'],
        blue: ['Pottery'],
        hand: ['Domestication'], // Drawn by Pottery's second dogma effect
        score: ['Mapmaking'], // Card scored normally (karma did not trigger)
      },
    })
  })

  test('karma: score card with same age top green and yellow but not highest, proceeds normally', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Pele'],        // Age 9 (highest)
        green: ['Paper'],        // Age 3
        yellow: ['Machinery'],   // Age 3 (same as green, but not highest)
        red: ['Archery'],
        blue: ['Pottery'],        // Age 1, to dogma and score
        hand: ['Tools', 'Writing'], // Age 1 cards to return for Pottery
      },
      decks: {
        base: {
          1: ['Domestication'],   // Age 1, will be drawn and scored by Pottery
          2: ['Mapmaking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Pottery')
    request = t.choose(game, 'Tools', 'Writing') // Return two cards
    request = t.choose(game, 'auto') // Confirm selection

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Pele'],
        green: ['Paper'],
        yellow: ['Machinery'],
        red: ['Archery'],
        blue: ['Pottery'],
        hand: ['Domestication'], // Drawn by Pottery's second dogma effect
        score: ['Mapmaking'], // Card scored normally (karma did not trigger)
      },
    })
  })
})
