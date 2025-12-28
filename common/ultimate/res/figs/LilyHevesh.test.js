Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Lily Hevesh', () => {
  test('karma: draw action, reveal 4 different colors (only 4 colors), draw one and splay aslant', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Lily Hevesh'],
        red: ['Archery', 'Gunpowder'], // Already have 2 cards so red can be splayed
        blue: ['Tools'],
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['The Wheel'], // Red
          2: ['Mathematics'], // Blue
          3: ['Paper'], // Green
          4: ['Experimentation'], // Blue (age 4) - duplicate color, but we need 5 different ages
          5: ['Astronomy'], // Purple (age 5)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: reveal top card of 5 decks, one at a time
    // Choose 5 different decks with different colors
    request = t.choose(game, request, 'base 1') // Archery (red)
    request = t.choose(game, request, 'base 2') // Mathematics (blue)
    request = t.choose(game, request, 'base 3') // Paper (green)
    request = t.choose(game, request, 'base 4') // Experimentation (blue, age 4) - duplicate color
    request = t.choose(game, request, 'base 5') // Astronomy (purple, age 5)
    // Only 4 distinct colors revealed (red, blue, green, purple) - no win because only 4 colors, draw one card and splay
    request = t.choose(game, request, 'The Wheel') // Choose to draw The Wheel
    request = t.choose(game, request, 'red') // Splay red aslant

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        purple: ['Lily Hevesh'],
        red: {
          cards: ['Archery', 'Gunpowder'],
          splay: 'aslant',
        },
        blue: ['Tools'],
        green: ['Sailing'],
        hand: ['The Wheel'], // The Wheel was drawn to hand
      },
    })
  })

  test('karma: draw action, reveal 5 different colors, player wins', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        purple: ['Lily Hevesh'],
        blue: ['Tools'],
        green: ['Sailing'],
      },
      decks: {
        base: {
          1: ['Archery'], // Red (age 1)
          2: ['Mathematics'], // Blue
          3: ['Paper'], // Green
          4: ['Anatomy'], // Yellow (age 4)
          5: ['Astronomy'], // Purple (age 5)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: reveal top card of 5 decks, one at a time
    // Choose 5 different decks with 5 different colors
    request = t.choose(game, request, 'base 1') // Archery (red)
    request = t.choose(game, request, 'base 2') // Mathematics (blue)
    request = t.choose(game, request, 'base 3') // Paper (green)
    request = t.choose(game, request, 'base 4') // Anatomy (yellow, age 4)
    request = t.choose(game, request, 'base 5') // Astronomy (purple, age 5)
    // 5 distinct colors revealed (red, blue, green, yellow, purple) - player wins

    t.testGameOver(request, 'dennis', 'Lily Hevesh')
  })
})
