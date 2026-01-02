Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Duke Ellington', () => {
  test('karma: no fade', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Duke Ellington'],  // Figure - has no-fade karma
        blue: ['Albert Einstein'],    // Figure
        yellow: ['Shennong'],        // Figure
        green: ['Fu Xi'],            // Figure
      },
      decks: {
        base: {
          2: ['Mapmaking'], // Fu Xi's karma draws and scores this first
          8: ['Flight'],     // Card to draw (highest top card is age 8)
        },
      },
    })
    // Top figures: Duke Ellington, Albert Einstein, Shennong, Fu Xi = 4 figures
    // Normally, having more than 1 top figure would require fading, but Duke Ellington prevents it

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // After drawing, fade check happens - Duke Ellington prevents fading
    // All 4 figures should remain on the board (no fading occurred)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Duke Ellington'],  // Still on board (not faded)
        blue: ['Albert Einstein'],    // Still on board (not faded)
        yellow: ['Shennong'],         // Still on board (not faded)
        green: ['Fu Xi'],             // Still on board (not faded)
        score: ['Mapmaking'],         // Scored by Fu Xi's karma (draws and scores {2} on first action)
        hand: ['Flight'],             // Card drawn (age 8, based on highest top card)
      },
    })
  })

  describe('If you would meld a figure and have at least four top figures already, instead you win.', () => {
    test('karma: meld figure with four top figures, win', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],  // Figure
          blue: ['Albert Einstein'],   // Figure
          yellow: ['Shennong'],        // Figure
          green: ['Fu Xi'],            // Figure
          hand: ['Alex Trebek'],       // Figure to meld
        },
      })
      // Top figures: Duke Ellington, Albert Einstein, Shennong, Fu Xi = 4 figures

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Alex Trebek')
      // Karma triggers: instead of melding Alex Trebek, player wins

      t.testGameOver(request, 'dennis', 'Duke Ellington')

      t.testBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],
          blue: ['Albert Einstein'],
          yellow: ['Shennong'],
          green: ['Fu Xi'],
          hand: ['Alex Trebek'], // Not melded because player won instead
        },
      })
    })

    test('karma: meld figure with five top figures, win', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],  // Figure
          blue: ['Albert Einstein'],   // Figure
          yellow: ['Shennong'],        // Figure
          green: ['Fu Xi'],            // Figure
          red: ['Erwin Rommel'],       // Figure
          hand: ['Homer'],             // Figure to meld
        },
      })
      // Top figures: Duke Ellington, Albert Einstein, Shennong, Fu Xi, Erwin Rommel = 5 figures

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Homer')
      // Karma triggers: instead of melding Homer, player wins

      t.testGameOver(request, 'dennis', 'Duke Ellington')

      t.testBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],
          blue: ['Albert Einstein'],
          yellow: ['Shennong'],
          green: ['Fu Xi'],
          red: ['Erwin Rommel'],
          hand: ['Homer'], // Not melded because player won instead
        },
      })
    })

    test('karma: meld figure with three top figures, normal meld', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],  // Figure
          blue: ['Albert Einstein'],   // Figure
          yellow: ['Shennong'],       // Figure
          hand: ['Fu Xi'],            // Figure to meld
        },
      })
      // Top figures: Duke Ellington, Albert Einstein, Shennong = 3 figures (not 4+)

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Fu Xi')
      // Karma does NOT trigger (only 3 top figures, not 4+)
      // Fu Xi is melded normally

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],
          blue: ['Albert Einstein'],
          yellow: ['Shennong'],
          green: ['Fu Xi'], // Fu Xi was melded normally
        },
      })
    })

    test('karma: meld non-figure, normal meld (karma does not trigger)', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],  // Figure
          blue: ['Albert Einstein'],   // Figure
          yellow: ['Shennong'],        // Figure
          green: ['Fu Xi'],            // Figure
          hand: ['Tools'],             // Non-figure to meld
        },
      })
      // Top figures: Duke Ellington, Albert Einstein, Shennong, Fu Xi = 4 figures
      // But Tools is not a figure, so karma does not trigger

      let request
      request = game.run()
      request = t.choose(game, request, 'Meld.Tools')
      // Karma does NOT trigger (Tools is not a figure)
      // Tools is melded normally

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Duke Ellington'],
          blue: ['Tools', 'Albert Einstein'], // Tools melded on top
          yellow: ['Shennong'],
          green: ['Fu Xi'],
        },
      })
    })
  })
})
