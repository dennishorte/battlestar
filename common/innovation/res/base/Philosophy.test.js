Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Philosophy', () => {

  describe('You may splay left any one color of your cards.', () => {
    test('choose a color', () => {
      const game = t.fixtureDogma('Philosophy')
      t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
      game.run()
      t.dogma(game, 'Philosophy')
      game.submit({
        actor: 'micah',
        name: 'Choose Color',
        option: ['red']
      })

      expect(game.getZoneColorByPlayer('micah', 'red').splay).toBe('left')
    })

    test('do not choose a color', () => {
      const game = t.fixtureDogma('Philosophy')
      t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
      game.run()
      t.dogma(game, 'Philosophy')
      game.submit({
        actor: 'micah',
        name: 'Choose Color',
        option: []
      })

      expect(game.getZoneColorByPlayer('micah', 'red').splay).toBe('none')
    })
  })

  describe('You may score a card from your hand', () => {
    test('return a card', () => {
      const game = t.fixtureDogma('Philosophy')
      game.run()
      t.dogma(game, 'Philosophy')
      game.submit({
        actor: 'micah',
        name: 'Choose Cards',
        option: ['Writing']
      })

      expect(game.getScore('micah')).toBe(1)
    })

    test('do not return a card', () => {
      const game = t.fixtureDogma('Philosophy')
      game.run()
      t.dogma(game, 'Philosophy')
      game.submit({
        actor: 'micah',
        name: 'Choose Cards',
        option: []
      })

      expect(game.getScore('micah')).toBe(0)
    })
  })
})
