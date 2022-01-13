Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Imhotep', () => {

  describe('echo', () => {
    test('draw and meld a 2', () => {
      const game = t.fixtureDogma('Imhotep', { expansions: ['base', 'figs'] })
      game.run()
      jest.spyOn(game, 'aDrawAndMeld')
      t.dogma(game, 'Imhotep')

      expect(game.aDrawAndMeld).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'micah' }),
        2
      )
    })
  })

  describe('karma', () => {

    describe('not applies', () => {
      test('does not apply if color is splayed', () => {
        const game = t.fixtureDogma('Imhotep', { expansions: ['base', 'figs'] })
        t.setColor(game, 'micah', 'red', ['Archery', 'Construction'])
        t.setSplay(game, 'micah', 'red', 'up')
        t.setHand(game, 'micah', ['Oars'])
        game.run()
        t.meld(game, 'Oars')

        const red = game.getZoneColorByPlayer('micah', 'red')
        expect(red.splay).toBe('up')
      })

      test('does not apply if color has only one card', () => {
        const game = t.fixtureDogma('Imhotep', { expansions: ['base', 'figs'] })
        t.setColor(game, 'micah', 'red', ['Archery'])
        t.setSplay(game, 'micah', 'red', 'up')
        t.setHand(game, 'micah', ['Oars'])
        game.run()
        t.meld(game, 'Oars')

        const red = game.getZoneColorByPlayer('micah', 'red')
        expect(red.splay).toBe('up')
        expect(red.cards.length).toBe(2)
      })
    })

    describe('applies', () => {
      test('color is splayed', () => {
        const game = t.fixtureDogma('Imhotep', { expansions: ['base', 'figs'] })
        t.setColor(game, 'micah', 'red', ['Archery', 'Construction'])
        t.setHand(game, 'micah', ['Oars'])
        game.run()
        t.meld(game, 'Oars')

        const red = game.getZoneColorByPlayer('micah', 'red')
        expect(red.splay).toBe('left')
      })

      test('card is returned', () => {
        const game = t.fixtureDogma('Imhotep', { expansions: ['base', 'figs'] })
        t.setColor(game, 'micah', 'red', ['Archery', 'Construction'])
        t.setHand(game, 'micah', ['Oars'])
        jest.spyOn(game, 'aReturn')
        game.run()
        t.meld(game, 'Oars')

        const red = game.getZoneColorByPlayer('micah', 'red')
        expect(red.cards.length).toBe(2)
        expect(game.getZoneByCard('Oars').name).toBe('decks.base.1')
      })
    })

  })

})
