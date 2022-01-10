Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Construction', () => {
  describe(`I demand you transfer two cards from your hand to my hand! Draw a {2}!`, () => {
    test('choose two cards', () => {
      const game = t.fixtureDogma('Construction')
      game.run()
      jest.spyOn(game, 'aChoose')
      t.dogma(game, 'Construction')

      expect(game.aChoose).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          playerName: 'tom',
          count: 2,
          kind: 'Cards',
        })
      )
      expect(game.aChoose).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          playerName: 'dennis',
          count: 2,
          kind: 'Cards',
        })
      )
    })

    test('draw a 2', () => {
      const game = t.fixtureDogma('Construction')
      game.run()
      jest.spyOn(game, 'aDraw')
      t.dogma(game, 'Construction')

      expect(game.aDraw).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'tom' }),
        2
      )
      expect(game.aDraw).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: 'dennis' }),
        2
      )
    })
  })

  describe(`If you are the only player with five top cards, claim the Empire achievement.`, () => {
    test('claim empire achievement', () => {
      const game = t.fixtureDogma('Construction')
      t.setColor(game, 'micah', 'green', ['Mapmaking'])
      t.setColor(game, 'micah', 'yellow', ['Fermenting'])
      t.setColor(game, 'micah', 'blue', ['Mathematics'])
      t.setColor(game, 'micah', 'purple', ['Monotheism'])
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.dogma(game, 'Construction')

      expect(game.getAchievements('micah').cards.includes('Empire')).toBe(true)
    })

    test('someone else has 5 top cards', () => {
      const game = t.fixtureDogma('Construction')
      t.setColor(game, 'micah', 'yellow', ['Fermenting'])
      t.setColor(game, 'micah', 'green', ['Mapmaking'])
      t.setColor(game, 'micah', 'blue', ['Mathematics'])
      t.setColor(game, 'micah', 'purple', ['Monotheism'])

      // Choosing cards from age 4 ensures no castles, so no sharing.
      t.setColor(game, 'dennis', 'red', ['Gunpowder'])
      t.setColor(game, 'dennis', 'yellow', ['Anatomy'])
      t.setColor(game, 'dennis', 'green', ['Navigation'])
      t.setColor(game, 'dennis', 'blue', ['Experimentation'])
      t.setColor(game, 'dennis', 'purple', ['Reformation'])


      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.dogma(game, 'Construction')

      expect(game.getAchievements('micah').cards.includes('Empire')).toBe(false)
    })

    test('do not have 5 top cards', () => {
      const game = t.fixtureDogma('Construction')
      game.run()
      jest.spyOn(game, 'aClaimAchievement')
      t.dogma(game, 'Construction')

      expect(game.getAchievements('micah').cards.includes('Empire')).toBe(false)
    })
  })
})
