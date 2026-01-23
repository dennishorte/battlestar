Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Samuel de Champlain', () => {
  describe('If you would draw a fifth card into your hand, first claim an achievement of that card\'s value or below, regardless of eligibility.', () => {
    test('karma: draw fifth card, claim age 1 achievement', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal', 'Tools', 'Calendar', 'The Wheel'], // 4 cards
        },
        decks: {
          base: {
            5: ['Astronomy'], // Age 5 card to draw
          },
        },
        achievements: ['Domestication', 'Banking', 'Democracy'], // Age 1, 4, 5
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: claim achievement of age 5 or below
      // Domestication (age 1) is available
      request = t.choose(game, '**base-1*')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal', 'Tools', 'Calendar', 'The Wheel'], // 5 cards
          achievements: ['Domestication'],
        },
      })
    })

    test('karma: draw fifth card, multiple achievements available, choose higher age', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal', 'Tools', 'Calendar', 'The Wheel'], // 4 cards
        },
        decks: {
          base: {
            5: ['Astronomy'], // Age 5 card to draw
          },
        },
        achievements: ['Domestication', 'Mathematics', 'Machinery', 'Banking'], // Ages 1, 2, 3, 4
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: claim achievement of age 5 or below
      // Multiple available, choose Machinery (age 3)
      request = t.choose(game, '**base-3*')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal', 'Tools', 'Calendar', 'The Wheel'],
          achievements: ['Machinery'],
        },
      })
    })

    test('karma: draw fifth card, claim achievement regardless of eligibility', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal', 'Tools', 'Calendar', 'The Wheel'], // 4 cards
        },
        decks: {
          base: {
            5: ['Astronomy'], // Age 5 card to draw
          },
        },
        achievements: ['Machinery'], // Age 3 achievement
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: claim achievement regardless of eligibility
      // dennis has no score, but can still claim Machinery (karma bypasses eligibility)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal', 'Tools', 'Calendar', 'The Wheel'],
          achievements: ['Machinery'], // Claimed despite not being eligible
        },
      })
    })

    test('karma: does not trigger when hand has 3 cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal', 'Tools', 'Calendar'], // 3 cards, not 4
        },
        decks: {
          base: {
            5: ['Astronomy'],
          },
        },
        achievements: ['Domestication'],
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma should NOT trigger (hand has 3 cards, not 4)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal', 'Tools', 'Calendar'], // 4 cards after draw
          achievements: [], // No achievement claimed
        },
      })
    })

    test('karma: does not trigger when hand has 5 cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal', 'Tools', 'Calendar', 'The Wheel', 'Sailing'], // 5 cards, not 4
        },
        decks: {
          base: {
            5: ['Astronomy'],
          },
        },
        achievements: ['Domestication'],
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma should NOT trigger (hand has 5 cards, not 4)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal', 'Tools', 'Calendar', 'The Wheel', 'Sailing'], // 6 cards after draw
          achievements: [], // No achievement claimed
        },
      })
    })
  })

  describe('If you would draw a first card into your hand, first draw a {6}.', () => {
    test('karma: draw first card, draw age 6 first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: [], // Empty hand
        },
        decks: {
          base: {
            5: ['Astronomy'], // Age 5 card (normal draw based on top card age)
            6: ['Industrialization'], // Age 6 card (drawn by karma first)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: draw age 6 first (Industrialization)
      // Then normal draw: draw age 5 (Astronomy)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Industrialization', 'Astronomy'], // Age 6 drawn first, then age 5
        },
      })
    })

    test('karma: does not trigger when hand has cards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Coal'], // Hand has 1 card, not empty
        },
        decks: {
          base: {
            5: ['Astronomy'],
            6: ['Industrialization'],
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma should NOT trigger (hand is not empty)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          hand: ['Astronomy', 'Coal'], // Only age 5 drawn, age 6 not drawn
        },
      })
    })

    test('karma: triggers on first draw from dogma effect', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          blue: ['Writing'],
        },
        decks: {
          base: {
            2: ['Construction'],
            6: ['Industrialization'], // Age 6 card (drawn by karma first)
          },
        },
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Writing')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['Samuel de Champlain'],
          blue: ['Writing'],
          hand: ['Industrialization', 'Construction'], // Age 6 drawn first, then an age 2
        },
      })
    })
  })
})
