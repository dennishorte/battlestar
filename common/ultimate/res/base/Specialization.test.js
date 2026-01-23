Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Specialization', () => {
  describe('Reveal and take', () => {
    test('take opponent top cards of matching color', () => {
      const game = t.fixtureFirstPlayer({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          purple: ['Specialization'],
          red: ['Flight'],
          hand: ['Oars'],
        },
        scott: {
          red: ['Archery'],
        },
        micah: {
          red: ['Metalworking', 'Optics'],
        },
      })

      game.run()
      t.choose(game, 'Dogma.Specialization')
      t.choose(game, 'auto')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Specialization'],
          red: ['Flight'],
          hand: ['Oars', 'Archery', 'Metalworking'],
        },
        scott: {},
        micah: {
          red: ['Optics'],
        },
      })
    })
  })

  describe('splay', () => {
    test('can splay', () => {
      const game = t.fixtureFirstPlayer({ numPlayers: 3 })
      t.setBoard(game, {
        dennis: {
          purple: ['Specialization'],
          blue: ['Mathematics', 'Experimentation'],
        },
      })

      game.run()
      t.choose(game, 'Dogma.Specialization')
      t.choose(game, 'blue')

      t.testIsSecondPlayer(game)
      t.testBoard(game, {
        dennis: {
          purple: ['Specialization'],
          blue: {
            cards: ['Mathematics', 'Experimentation'],
            splay: 'up',
          },
        },
      })
    })
  })
})
