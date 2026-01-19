Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Niccolo Machiavelli', () => {

  describe('Each color splayed right only on your board counts as an achievement for you.', () => {
    test('karma: colors splayed right only on owner board count as achievements', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: {
            cards: ['Niccolo Machiavelli', 'Code of Laws'],
            splay: 'right',
          },
          blue: {
            cards: ['Computers', 'Mathematics'],
            splay: 'right',
          },
          red: {
            cards: ['Archery', 'Construction'],
            splay: 'right',
          },
          yellow: {
            cards: ['Canning', 'Agriculture'],
            splay: 'left', // Not right, doesn't count
          },
          green: ['The Wheel'], // Not splayed, doesn't count
        },
        micah: {
          blue: ['Tools'], // Not splayed right, so dennis's blue counts
          red: {
            cards: ['Gunpowder', 'Engineering'],
            splay: 'left' // Not right, so dennis's red counts
          }
        },
      })

      let request
      request = game.run()

      // Purple, blue, and red are splayed right only on dennis's board = 3 achievements
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(3)
    })

    test('karma: colors splayed right on both boards do not count', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: {
            cards: ['Niccolo Machiavelli', 'Code of Laws'],
            splay: 'right',
          },
          blue: {
            cards: ['Computers', 'Mathematics'],
            splay: 'right',
          },
        },
        micah: {
          blue: {
            cards: ['Tools', 'Writing'],
            splay: 'right', // Also splayed right, so dennis's blue doesn't count
          },
        },
      })

      let request
      request = game.run()

      // Only purple is splayed right only on dennis's board = 1 achievement
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(1)
    })

    test('karma: colors not splayed right do not count', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: {
            cards: ['Niccolo Machiavelli', 'Code of Laws'],
            splay: 'left', // Not right
          },
          blue: {
            cards: ['Computers', 'Mathematics'],
            splay: 'up', // Not right
          },
          red: ['Archery'], // Not splayed
        },
        micah: {
          blue: ['Tools'],
        },
      })

      let request
      request = game.run()

      // No colors splayed right only on dennis's board = 0 achievements
      expect(game.getAchievementsByPlayer(t.dennis(game)).other.length).toBe(0)
    })
  })

  describe('If you would splay a color on your board, first unsplay that color on all opponent\'s boards.', () => {
    test('karma: splay color, unsplay same color on opponent board first', () => {
      const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
      t.setBoard(game, {
        dennis: {
          purple: ['Niccolo Machiavelli'],
          green: ['Paper', 'Sailing'],
        },
        micah: {
          green: {
            cards: ['Navigation', 'The Wheel'],
            splay: 'right', // Will be unsplayed by karma
          },
        },
        decks: {
          base: {
            4: ['Enterprise'],
          }
        }
      })

      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Paper')
      request = t.choose(game, request, 'green')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Niccolo Machiavelli'],
          green: {
            cards: ['Paper', 'Sailing'],
            splay: 'left',
          },
          hand: ['Enterprise'],
        },
        micah: {
          green: ['Navigation', 'The Wheel'],
        },
      })
    })
  })

})
