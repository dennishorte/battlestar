Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('George Stephenson', () => {

  describe('If you would dogma a card of a color you have splayed right, first splay that color on your board up.', () => {
    test('karma: dogma card of color splayed right, splay that color up', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          red: {
            cards: ['Archery', 'Metalworking', 'Construction'],
            splay: 'right', // Red splayed right
          },
        },
        decks: {
          base: {
            1: ['Tools'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Archery')
      request = t.choose(game, '**base-1*')
      // Karma triggers: splay red up (was right, now up)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          red: {
            cards: ['Archery', 'Metalworking', 'Construction'],
            splay: 'up', // Red splayed up (changed from right)
          },
          hand: ['Tools']
        },
      })
    })

    test('karma: does not trigger if color not splayed right', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          red: {
            cards: ['Archery', 'Metalworking', 'Construction'],
            splay: 'left', // Red splayed left, not right
          },
        },
        decks: {
          base: {
            1: ['Tools'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Dogma.Archery')
      request = t.choose(game, '**base-1*')
      // Karma should NOT trigger (red is splayed left, not right)

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          red: {
            cards: ['Archery', 'Metalworking', 'Construction'],
            splay: 'left', // Red remains splayed left (karma did not trigger)
          },
          hand: ['Tools']
        },
      })
    })
  })

  describe('If you would claim an achievement, first transfer the bottom yellow card on each board to the available achievements.', () => {
    test('karma: claim achievement, transfer bottom yellow cards from all boards', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          yellow: ['Agriculture', 'Masonry'], // Masonry is bottom yellow card
          score: ['Canning'], // Age 10, enough score for age 1 achievement
        },
        micah: {
          yellow: ['Vaccination', 'Antibiotics'], // Antibiotics is bottom yellow card
        },
        achievements: ['Sailing'], // Age 1 achievement to claim
        decks: {
          figs: {
            6: ['John Loudon McAdam'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, 'Achieve.*base-1*') // Claim age 1 achievement (Sailing)
      request = t.choose(game, 'auto')


      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          green: ['George Stephenson'],
          yellow: ['Agriculture'],
          score: ['Canning'],
          achievements: ['Sailing'],
        },
        micah: {
          yellow: ['Vaccination'],
          hand: ['John Loudon McAdam'],
        },
        standardAchievements: ['Masonry', 'Antibiotics'],
      })
    })
  })
})
