Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Ludwig Van Beethoven', () => {

  test('karma: decree', () => {
    t.testDecreeForTwo('Ludwig Van Beethoven', 'Rivalry')
  })

  describe('If you would score a card, first junk all cards from your score pile, then draw and score four {5}. If you score only {5}, draw and score four {5}.', () => {
    test('karma: score card, junk score pile, draw and score four age 5', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Ludwig Van Beethoven'],
          yellow: ['Agriculture'],
          hand: ['Sailing'],
          score: ['Archery'], // Card in score pile to be junked
        },
        achievements: ['Steam Engine'],
        decks: {
          base: {
            2: ['Mapmaking'],
            6: ['Canning'],
          }
        },
        decksExact: {
          base: {
            5: ['Measurement', 'Coal', 'Chemistry'], // Four age 5 cards to draw and score by karma
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Sailing')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Ludwig Van Beethoven'],
          yellow: ['Agriculture'],
          score: ['Measurement', 'Coal', 'Chemistry', 'Canning', 'Mapmaking'], // Four age 5 cards scored by karma
        },
        junk: [
          'Archery',
          'Astronomy',
          'Banking',
          'Physics',
          'Societies',
          'Statistics',
          'The Pirate Code',
        ],
      })
    })

    test('karma: all four are age 5, draw and score four more', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Ludwig Van Beethoven'],
          yellow: ['Agriculture'],
          hand: ['Sailing'],
          score: ['Archery'], // Card in score pile to be junked
        },
        decks: {
          base: {
            2: ['Mapmaking'],
            5: [
              'Measurement',
              'Coal',
              'Chemistry',
              'Astronomy',
              'Banking',
              'Statistics',
              'The Pirate Code',
              'Societies',
            ],
          }
        },
        decksExact: {
          base: {
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Agriculture')
      request = t.choose(game, 'Sailing')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Ludwig Van Beethoven'],
          yellow: ['Agriculture'],
          score: [
            'Measurement',
            'Coal',
            'Chemistry',
            'Astronomy',
            'Mapmaking',
            'Banking',
            'Statistics',
            'The Pirate Code',
            'Societies',
          ], // Four age 5 cards scored by karma
        },
        junk: [
          'Archery',
        ],
      })
    })

  })
})
