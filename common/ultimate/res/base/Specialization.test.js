Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Specialization', () => {
  describe('Reveal and take', () => {
    test('take opponent top cards of matching color', () => {
      const game = t.fixtureTopCard('Specialization', { numPlayers: 3 })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Flight'])
        t.setColor(game, 'scott', 'red', ['Archery'])
        t.setColor(game, 'micah', 'red', ['Metalworking', 'Optics'])
        t.setHand(game, 'dennis', ['Oars'])
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
      const game = t.fixtureTopCard('Specialization', { numPlayers: 3 })
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'blue', ['Mathematics', 'Experimentation'])
        t.setHand(game, 'dennis', [])
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Specialization')
      request = t.choose(game, request, 'blue')

      expect(t.zone(game, 'blue').splay).toBe('up')
    })
  })
})
