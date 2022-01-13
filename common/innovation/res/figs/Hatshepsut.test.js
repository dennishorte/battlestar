Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Hatshepsut', () => {

  describe('inspire', () => {
    test('draw a 1', () => {
      const game = t.fixtureDogma('Hatshepsut', { expansions: ['base', 'figs'] })
      game.run()
      t.inspire(game, 'green')

      expect(game.getHand('micah').cards.length).toBe(3)
    })
  })

  describe('karma', () => {
    test('if you would draw', () => {
      const game = t.fixtureDogma('Hatshepsut', { expansions: ['base', 'figs'] })
      t.setColor(game, 'dennis', 'blue', []) // Prevents sharing
      t.setColor(game, 'micah', 'blue', ['Writing'])
      t.setHand(game, 'micah', ['Imhotep'])

      jest.spyOn(game, 'aReturnMany')
      jest.spyOn(game, 'aDrawMany')

      game.run()
      t.dogma(game, 'Writing')

      expect(game.aReturnMany).toHaveBeenCalled()
      expect(game.aDrawMany).toHaveBeenCalled()

      const handAges = game
        .getHand('micah')
        .cards
        .map(game.getCardData)
        .map(c => c.age)
      expect(handAges).toStrictEqual([2, 2, 2])
    })
  })

})
