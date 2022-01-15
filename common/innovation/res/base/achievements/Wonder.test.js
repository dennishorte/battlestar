Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Wonder Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'red', ['Flight', 'Archery'])
    t.setColor(game, 'micah', 'yellow', ['Skyscrapers', 'Masonry'])
    t.setColor(game, 'micah', 'green', ['Corporations', 'Sailing',])
    t.setColor(game, 'micah', 'blue', ['Rocketry', 'Writing',])
    t.setColor(game, 'micah', 'purple', ['Mysticism', 'Empiricism'])

    t.setSplay(game, 'micah', 'yellow', 'right')
    t.setSplay(game, 'micah', 'green', 'right')
    t.setSplay(game, 'micah', 'blue', 'up')
    t.setSplay(game, 'micah', 'purple', 'right')
    game.run()

    t.dogma(game, 'Flight')
    t.choose(game, 'red')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Wonder'])
  })
})
