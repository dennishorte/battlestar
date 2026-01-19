Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Philosophy', () => {

  describe('You may splay left any one color of your cards.', () => {
    test('choose a color', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Construction', 'Industrialization'])
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request, 'red')

      const red = game.zones.byPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('left')
    })

    test('do not choose a color', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setColor(game, 'dennis', 'red', ['Construction', 'Industrialization'])
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request)

      const red = game.zones.byPlayer(t.dennis(game), 'red')
      expect(red.splay).toBe('none')
    })
  })

  describe('You may score a card from your hand', () => {
    test('return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'dennis', ['Construction', 'Industrialization'])
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request, 'Industrialization')

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual(['Industrialization'])
    })

    test('do not return a card', () => {
      const game = t.fixtureTopCard('Philosophy')
      game.testSetBreakpoint('before-first-player', (game) => {
        t.setHand(game, 'dennis', ['Construction', 'Industrialization'])
      })
      let request
      request = game.run()
      request = t.choose(game, request, 'Dogma.Philosophy')
      t.choose(game, request)

      const score = game.zones.byPlayer(t.dennis(game), 'score').cardlist().map(c => c.name)
      expect(score).toEqual([])
    })
  })
})
