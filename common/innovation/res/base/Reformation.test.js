Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Reformation', () => {
  describe('Tuck cards', () => {
    test('choose not to tuck', () => {
      const game = t.fixtureDogma('Reformation')
      t.setColor(game, 'micah', 'green', ['Clothing'])
      t.setHand(game, 'micah', ['Mapmaking', 'Currency', 'Philosophy'])
      game.run()
      jest.spyOn(game, 'aTuck')
      t.dogma(game, 'Reformation')
      t.choose(game, 'Skip this effect')

      expect(game.aTuck.mock.calls.length).toBe(0)
      expect(game.getZoneColorByPlayer('micah', 'green').cards).toStrictEqual(['Clothing'])
      expect(game.getWaiting('micah').name).toBe('Choose Color')
    })

    test('number of leaf biscuits on board', () => {
      const game = t.fixtureDogma('Reformation')
      t.setColor(game, 'micah', 'green', ['Clothing'])
      t.setHand(game, 'micah', ['Mapmaking', 'Currency', 'Philosophy'])
      game.run()
      t.dogma(game, 'Reformation')

      jest.spyOn(game, 'aTuck')
      t.choose(game, 'Tuck 2 cards from hand')
      t.choose(game, 'Mapmaking')
      t.choose(game, 'Currency')

      expect(game.aTuck.mock.calls.length).toBe(2)
      expect(game.getZoneColorByPlayer('micah', 'green').cards).toStrictEqual([
        'Clothing', 'Mapmaking', 'Currency'
      ])
    })
  })

  describe('splay', () => {
    test('can splay', () => {
      const game = t.fixtureDogma('Reformation')
      jest.spyOn(game, 'aChooseAndSplay')
      game.run()
      t.dogma(game, 'Reformation')
      t.choose(game, 'Skip this effect')

      expect(game.aChooseAndSplay).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          playerName: 'micah',
          choices: ['yellow', 'purple'],
          direction: 'right',
        })
      )
    })
  })
})
