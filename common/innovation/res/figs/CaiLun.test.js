Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Cai Lun', () => {

  describe('echo', () => {
    describe('You may splay one color of your cards left.', () => {
      test('choose a color', () => {
        const game = t.fixtureDogma('Cai Lun')
        t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
        game.run()
        t.dogma(game, 'Cai Lun')
        game.submit({
          actor: 'micah',
          name: 'Choose Color',
          option: ['red']
        })

        expect(game.getZoneColorByPlayer('micah', 'red').splay).toBe('left')
      })

      test('do not choose a color', () => {
        const game = t.fixtureDogma('Cai Lun')
        t.setColor(game, 'micah', 'red', ['Construction', 'Industrialization'])
        game.run()
        t.dogma(game, 'Cai Lun')
        game.submit({
          actor: 'micah',
          name: 'Choose Color',
          option: []
        })

        expect(game.getZoneColorByPlayer('micah', 'red').splay).toBe('none')
      })

    })
  })

  describe('karma', () => {
    test('If you would claim an achievement, first draw and foreshadow a {3}.', () => {
      const game = t.fixtureDogma('Cai Lun', { expansions: ['base', 'figs'] })
      t.setScore(game, 'micah', ['Coal'])
      t.setAchievements(game, ['Imhotep'])
      game.run()
      t.achieveStandard(game, 1)

      const forecastAges = t.getZoneAges(game, game.getForecast('micah'))
      expect(forecastAges).toStrictEqual([3])
    })

    test('Each card in your forecast counts as an available achievement for you.', () => {
      const game = t.fixtureDogma('Cai Lun', { expansions: ['base', 'figs'] })
      t.setForecast(game, 'micah', ['Clothing'])
      t.setScore(game, 'micah', ['Coal'])
      game.run()

      expect(game.getWaiting('micah').options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Karma Achievements',
            options: expect.arrayContaining(['Clothing'])
          })
        ])
      )
    })
  })
})
