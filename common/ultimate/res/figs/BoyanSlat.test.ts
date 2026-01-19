Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Boyan Slat', () => {
  test('karma: draw card, choose value, return exactly one card from score, achieve it', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Boyan Slat'], // Owner of karma card
        score: ['The Wheel'], // Age 1 card in score
      },
      decks: {
        base: {
          11: ['Hypersonics'], // Card to draw (Boyan Slat is age 11, so draws age 11)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: choose a value and return all cards of that value from all score piles
    request = t.choose(game, request, 1) // Choose age 1
    // The Wheel (age 1) is returned from score
    // Exactly one card returned, so achieve it (regardless of eligibility)

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Boyan Slat'],
        score: [], // The Wheel was returned
        hand: ['Hypersonics'], // Hypersonics drawn
        achievements: ['The Wheel'], // The Wheel was achieved
      },
    })
  })

  test('karma: draw card, choose value, return 0 cards, no achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Boyan Slat'], // Owner of karma card
        score: ['The Wheel'], // Age 1 card in score
      },
      decks: {
        base: {
          11: ['Hypersonics'], // Card to draw (Boyan Slat is age 11, so draws age 11)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: choose a value and return all cards of that value from all score piles
    request = t.choose(game, request, 2) // Choose age 2 (no cards of this value in score)
    // No cards of age 2 in score, so nothing returned
    // No achievement claimed

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Boyan Slat'],
        score: ['The Wheel'], // The Wheel remains (age 1, not age 2)
        hand: ['Hypersonics'], // Hypersonics drawn
        achievements: [], // No achievement claimed
      },
    })
  })

  test('karma: draw card, choose value, return multiple cards, no achievement', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    t.setBoard(game, {
      dennis: {
        green: ['Boyan Slat'], // Owner of karma card
        score: ['The Wheel', 'Tools'], // Two age 1 cards in score
      },
      decks: {
        base: {
          11: ['Hypersonics'], // Card to draw (Boyan Slat is age 11, so draws age 11)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: choose a value and return all cards of that value from all score piles
    request = t.choose(game, request, 1) // Choose age 1
    request = t.choose(game, request, 'auto')
    // The Wheel and Tools (both age 1) are returned from score
    // More than one card returned, so no achievement

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Boyan Slat'],
        score: [], // Both cards returned
        hand: ['Hypersonics'], // Hypersonics drawn
        achievements: [], // No achievement (more than one card returned)
      },
    })
  })

  test('karma: draw card, choose value, return cards from multiple players score piles', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'], numPlayers: 2 })
    t.setBoard(game, {
      dennis: {
        green: ['Boyan Slat'], // Owner of karma card
        score: ['The Wheel'], // Age 1 card in dennis's score
      },
      micah: {
        score: ['Tools'], // Age 1 card in micah's score
      },
      decks: {
        base: {
          11: ['Hypersonics'], // Card to draw (Boyan Slat is age 11, so draws age 11)
        }
      }
    })

    let request
    request = game.run()
    request = t.choose(game, request, 'Draw.draw a card')
    // Karma triggers: choose a value and return all cards of that value from all score piles
    request = t.choose(game, request, 1) // Choose age 1
    // The Wheel (from dennis) and Mathematics (from micah) are returned from score
    // returnMany processes cards one at a time, asking which card to return next
    request = t.choose(game, request, 'auto')
    // More than one card returned, so no achievement

    t.testIsSecondPlayer(game)
    t.testBoard(game, {
      dennis: {
        green: ['Boyan Slat'],
        score: [], // The Wheel returned
        hand: ['Hypersonics'], // Hypersonics drawn
        achievements: [], // No achievement (more than one card returned)
      },
      micah: {
        score: [], // Mathematics returned
      },
    })
  })
})
