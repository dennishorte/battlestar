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
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Specialization')
      request = t.choose(game, request, 'auto')

      expect(t.cards(game, 'hand').sort()).toEqual([
        'Archery',
        'Metalworking',
        'Oars',
      ].sort())
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
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Specialization')
      request = t.choose(game, request, 'blue')

      expect(t.zone(game, 'blue').splay).toBe('up')
    })
  })
})
