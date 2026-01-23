Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Stephen Hawking', () => {
  // Test Plan:
  //
  // Dogma karma tests:
  // 1. dogma a card, score bottom card once (1 {h} visible in that color)
  // 2. dogma a card, score bottom card multiple times (multiple {h} visible)
  // 3. dogma a card, no {h} visible, no scoring
  // 4. dogma a card, color has no cards (edge case)
  //
  // Draw karma tests:
  // 5. draw a card, first draw and tuck same age
  // 6. draw via dogma effect, first draw and tuck same age

  test('karma: dogma card, score bottom card once (1 {h} visible)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        green: ['Sailing', 'Mapmaking'],
      },
      decks: {
        base: {
          1: ['Clothing', 'Metalworking'],
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Sailing')
    // Karma triggers: score bottom green card (Mapmaking) once (1 {h} visible from Mapmaking)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        red: ['Metalworking'],
        blue: ['Stephen Hawking'],
        green: ['Sailing', 'Clothing'],
        score: ['Mapmaking'], // Scored by karma
      },
    })
  })

  test('karma: dogma card, score bottom card multiple times (multiple {h} visible)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        yellow: {
          cards: ['Agriculture', 'Domestication', 'Canning'], // Agriculture on top (to dogma), others below
          splay: 'up', // Splay up makes biscuits at indices 1, 2, 3 visible
        },
      },
      decks: {
        base: {
          2: ['Mathematics'],
        }
      }
    })
    // With splay up, biscuits at indices 1, 2, 3 are visible
    // Agriculture: hlll (indices 0=h, 1=l, 2=l, 3=l) - no {h} at 1, 2, or 3
    // Domestication: hhll (indices 0=h, 1=h, 2=l, 3=l) - {h} at 1, visible!
    // Canning: hhcc (indices 0=h, 1=h, 2=c, 3=c) - {h} at 1, visible!
    // So 2 {h} visible, should score bottom card twice:
    // First: score Canning (bottom), then score Domestication (new bottom)

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Agriculture')
    // Karma triggers: score bottom yellow card twice (2 {h} visible)
    // First iteration: score Canning (bottom card)
    // Second iteration: score Domestication (new bottom card)
    // Agriculture's dogma: return a card from hand (none), so no effect

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        yellow: ['Agriculture'], // Canning and Domestication were scored
        score: ['Canning', 'Domestication'], // Both scored by karma
      },
    })
  })

  test('karma: dogma card, color has no cards (edge case)', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        yellow: ['Agriculture'], // Agriculture on top (to dogma), no other cards in yellow
      },
    })

    let request
    request = game.run()
    request = t.choose(game, 'Dogma.Agriculture')
    // Karma triggers: count {h} visible in yellow
    // Agriculture (top): hlll - {h} at index 0, visible (top card shows all biscuits)
    // So 1 {h} visible, should try to score bottom yellow card
    // But there's only one card (Agriculture), so it's both top and bottom
    // Should score Agriculture itself

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        yellow: [], // Agriculture was scored (it was the bottom card)
        score: ['Agriculture'], // Scored by karma
      },
    })
  })

  test('karma: draw a card, first draw and tuck same age', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'], // Age 10, so draw action will draw age 10
      },
      decks: {
        base: {
          10: ['Robotics', 'Software'], // Robotics for tuck, Software for normal draw
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, 'Draw.draw a card')
    // Karma triggers: first draw and tuck a card of the same age (age 10)
    // Draws Robotics (age 10) and tucks it
    // Then normal draw: draws Software (age 10)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        blue: ['Stephen Hawking'],
        red: ['Robotics'], // Robotics was drawn and tucked (red card)
        hand: ['Software'], // Software was drawn normally
      },
    })
  })
})
