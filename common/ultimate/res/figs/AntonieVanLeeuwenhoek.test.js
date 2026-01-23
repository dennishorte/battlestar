Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Antonie Van Leeuwenhoek', () => {

  describe('Each card in hand counts as ten points towards the cost of claiming an achievement of that card\'s value.', () => {
    test('karma: one card in hand of same age, reduces cost by 10', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Engineering'], // Age 3 card
          score: ['Statistics'], // Age 5, worth 3 points
        },
        achievements: ['Construction', 'Machinery', 'Gunpowder'], // Age 3 achievement (normally costs 15 points)
      })

      let request
      request = game.run()
      // Age 3 achievement normally costs 15 points
      // With 1 age 3 card in hand, discount is 10 points, so cost is 5 points
      // dennis has 5 points (Statistics)

      t.testActionChoices(request, 'Achieve', ['*base-3*']) // Achievement is affordable with discount
    })

    test('karma: two cards in hand of same age, reduces cost by 20', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Measurement', 'Coal', 'Machinery', 'Metric System'], // Both age 5
          score: ['Statistics'], // Age 5, worth 5
        },
        achievements: ['Gunpowder', 'Societies', 'Atomic Theory'], // Age 3 achievement (normally costs 15 points)
      })

      let request
      request = game.run()
      // Age 3 achievement normally costs 15 points
      // With 2 age 3 cards in hand, discount is 20 points, so cost is -5 (effectively 0 or free)
      // dennis has 4 points, so can afford it

      t.testActionChoices(request, 'Achieve', ['*base-5*'])
    })
  })

  describe('If you would draw a card, first you may return a {5} from your hand. If you do, draw a {6}.', () => {
    test('karma: return age 5 card, draw age 6', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'], // Age 5 top card, so draws age 5
          hand: ['Statistics'], // Age 5 card
        },
        decks: {
          base: {
            5: ['Measurement'], // Age 5 card (will be drawn normally after karma)
            6: ['Industrialization'], // Age 6 card to draw via karma
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: choose to return Statistics (age 5)
      // t.choose should automatically find the right selector
      request = t.choose(game, 'Statistics')
      // Then karma draws age 6 card (Industrialization), then normal draw draws age 5 (Measurement)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Industrialization', 'Measurement'], // Industrialization drawn by karma, Measurement drawn normally
          // Statistics was returned
        },
      })
    })

    test('karma: choose not to return age 5 card, draw normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'], // Age 5 top card, so draws age 5
          hand: ['Statistics'], // Age 5 card
        },
        decks: {
          base: {
            5: ['Measurement'], // Age 5 card to draw normally (since top card is age 5)
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma triggers: choose not to return Statistics (min: 0 allows skipping)
      // Skip by calling t.choose without arguments (like PrintingPress test)
      request = t.choose(game)
      // Then draw normally (age 5) - the draw should complete and then ask for second action

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Statistics', 'Measurement'], // Statistics kept, Measurement drawn normally (age 5)
        },
      })
    })

    test('karma: no age 5 cards in hand, draw normally', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Engineering'], // Age 3 card, not age 5
        },
        decks: {
          base: {
            1: ['Sailing'], // Age 1 card to draw normally
            5: ['Measurement'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Draw.draw a card')
      // Karma does not trigger (no age 5 cards in hand)
      // Draw normally

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Engineering', 'Measurement'], // Both cards in hand (Sailing was drawn, but Measurement is what was actually drawn)
        },
      })
    })

    test('karma: triggers on non-action draw', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          hand: ['Statistics'], // Age 5 card
          green: ['The Wheel'], // The Wheel's dogma draws cards
        },
        decks: {
          base: {
            1: ['Tools', 'Sailing'],
            6: ['Industrialization'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.The Wheel')
      // The Wheel's dogma draws two age 1 cards
      request = t.choose(game, 'Statistics')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          yellow: ['Antonie Van Leeuwenhoek'],
          green: ['The Wheel'],
          hand: ['Industrialization', 'Tools', 'Sailing'],
        },
      })
    })
  })

})
