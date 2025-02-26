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
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Specialization')
      const request3 = t.choose(game, request2, 'auto')

      expect(t.cards(game, 'hand').sort()).toStrictEqual([
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
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Specialization')
      const request3 = t.choose(game, request2, 'blue')

      expect(t.zone(game, 'blue').splay).toBe('up')
    })
  })
})
