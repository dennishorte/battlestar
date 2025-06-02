Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Philosophy', () => {

  describe('You may splay left any one color of your cards.', () => {
    test('choose a color', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Construction', 'Industrialization'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Philosophy')
      t.choose(game, request2, 'red')

      const red = game.getZoneByPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('left')
    })

    test('do not choose a color', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Construction', 'Industrialization'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Philosophy')
      t.choose(game, request2)

      const red = game.getZoneByPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('none')
    })
  })

  describe('You may score a card from your hand', () => {
    test('return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'dennis', ['Construction', 'Industrialization'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Philosophy')
      t.choose(game, request2, 'Industrialization')

      const score = game.getZoneByPlayer(t.dennis(game), 'score').cards().map(c => c.name)
      expect(score).toEqual(['Industrialization'])
    })

    test('do not return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'dennis', ['Construction', 'Industrialization'])
      })
      const request1 = game.run()
      const request2 = t.choose(game, request1, 'Dogma.Philosophy')
      t.choose(game, request2)

      const score = game.getZoneByPlayer(t.dennis(game), 'score').cards().map(c => c.name)
      expect(score).toEqual([])
    })
  })
})
