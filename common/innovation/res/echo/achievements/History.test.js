Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('History', () => {
  test('four effects in one color', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'yellow', ['Chopsticks', 'Toothbrush', 'Deodorant'])
    t.setSplay(game, 'micah', 'yellow', 'up')
    t.setHand(game, 'micah', ['Barometer'])
    game.run()
    t.meld(game, 'Barometer')

    expect(game.getAchievements('micah').cards).toStrictEqual(['History'])
  })

  test('three effects in one color', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'yellow', ['Chopsticks', 'Toothbrush'])
    t.setSplay(game, 'micah', 'yellow', 'up')
    t.setHand(game, 'micah', ['Barometer'])
    game.run()
    t.meld(game, 'Barometer')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })

  test('four effects spread across two colors', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'yellow', ['Chopsticks', 'Toothbrush', 'Deodorant'])
    t.setSplay(game, 'micah', 'yellow', 'up')
    t.setHand(game, 'micah', ['Toilet'])
    game.run()
    t.meld(game, 'Toilet')

    expect(game.getAchievements('micah').cards).toStrictEqual([])
  })
})
