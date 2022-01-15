Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Specialization', () => {
  describe('Reveal and take', () => {
    test('take opponent top cards of matching color', () => {
      const game = t.fixtureDogma('Specialization')
      t.setColor(game, 'micah', 'red', ['Flight'])
      t.setColor(game, 'tom', 'red', ['Archery'])
      t.setColor(game, 'dennis', 'red', ['Coal', 'Gunpowder'])
      t.setHand(game, 'micah', ['Oars'])
      game.run()

      t.dogma(game, 'Specialization')

      expect(game.getHand('micah').cards.sort()).toStrictEqual([
        'Oars',
        'Archery',
        'Coal',
      ].sort())
    })
  })

  describe('splay', () => {
    test('can splay', () => {
      const game = t.fixtureDogma('Specialization')
      jest.spyOn(game, 'aChooseAndSplay')
      game.run()
      t.dogma(game, 'Specialization')

      expect(game.aChooseAndSplay).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          playerName: 'micah',
          choices: ['blue', 'yellow'],
          direction: 'up',
        })
      )
    })
  })
})
