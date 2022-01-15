Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Murasaki Shikibu', () => {
  describe('inspire', () => {
    test('Draw a {3}', () => {
      const game = t.fixtureDogma('Murasaki Shikibu', { expansions: ['base', 'figs'] })
      game.run()
      t.inspire(game, 'purple')

      const handAges = t.getZoneAges(game, game.getHand('micah'))
      expect(handAges).toStrictEqual([1, 3, 3])
    })
  })

  describe('karma', () => {
    test('Rivalry decree', () => {
      const game = t.fixtureFirstPicks({ expansions: ['base', 'figs'] })
      t.setColor(game, 'micah', 'purple', ['Murasaki Shikibu'])
      t.setHand(game, 'micah', ['Homer', 'Fu Xi'])
      game.run()
      expect(game.getWaiting('micah').options).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Decree',
          options: ['Rivalry']
        })
      ]))
    })

    describe('If you would claim a standard achievement', () => {

      test('standard, available in score pile', () => {
        const game = t.fixtureDogma('Murasaki Shikibu', { expansions: ['base', 'figs'] })
        t.setScore(game, 'micah', ['Sinuhe', 'Coal'])
        // Set a specific achievement in the 1 slot
        t.setAchievements(game, ['Imhotep'])
        game.run()
        t.achieveStandard(game, 1)

        expect(game.getAchievements('micah').cards).toStrictEqual(['Sinuhe'])
      })

      test('standard, available in score pile and can claim second one', () => {
        const game = t.fixtureDogma('Murasaki Shikibu', { expansions: ['base', 'figs'] })
        t.setScore(game, 'micah', ['Sinuhe', 'Coal', 'Computers'])
        // Set a specific achievement in the 1 slot
        t.setAchievements(game, ['Imhotep'])
        game.run()
        t.achieveStandard(game, 1)

        expect(game.getAchievements('micah').cards).toStrictEqual(['Sinuhe', 'Imhotep'])
      })

      test('standard, not available in score pile', () => {
        const game = t.fixtureDogma('Murasaki Shikibu', { expansions: ['base', 'figs'] })
        t.setScore(game, 'micah', ['Coal'])
        // Set a specific achievement in the 1 slot
        t.setAchievements(game, ['Imhotep'])
        game.run()
        t.achieveStandard(game, 1)

        expect(game.getAchievements('micah').cards).toStrictEqual(['Imhotep'])
      })

      test('non-standard', () => {
        const game = t.fixtureDogma('Murasaki Shikibu', { expansions: ['base', 'echo', 'figs'] })
        t.setScore(game, 'micah', ['Sinuhe', 'Coal', 'Computers'])

        // Setup to be able to claim Supremacy
        t.setColor(game, 'micah', 'green', ['The Wheel'])
        t.setColor(game, 'micah', 'yellow', ['Masonry'])
        t.setColor(game, 'micah', 'red', ['Metalworking'])
        t.setColor(game, 'micah', 'blue', ['Writing', 'Tools'])
        t.setSplay(game, 'micah', 'blue', 'up')
        t.setHand(game, 'micah', ['Alchemy'])

        game.run()
        t.meld(game, 'Alchemy')

        expect(game.getAchievements('micah').cards).toStrictEqual(['Supremacy'])
      })

    })
  })
})
