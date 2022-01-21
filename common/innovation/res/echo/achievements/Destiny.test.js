Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Destiny', () => {
  test('gained on the seventh card', () => {
    const game = t.fixtureDogma('Bangle', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', [])
    t.setForecast(game, 'micah', [
      'Magnifying Glass',
      'Sandpaper',
      'Chintz',
      'Globe',
      'Clock',
      'Shuriken',
    ])
    game.run()
    t.dogma(game, 'Bangle')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Destiny'])
  })

  test('not gained on sixth card', () => {
    const game = t.fixtureDogma('Bangle', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', [])
    t.setForecast(game, 'micah', [
      'Magnifying Glass',
      'Sandpaper',
      'Chintz',
      'Globe',
      'Clock',
    ])
    game.run()
    t.dogma(game, 'Bangle')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })
})
