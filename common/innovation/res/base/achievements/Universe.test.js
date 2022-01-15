Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Universe Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPicks()
    t.setColor(game, 'micah', 'red', ['Flight'])
    t.setColor(game, 'micah', 'yellow', ['Skyscrapers'])
    t.setColor(game, 'micah', 'green', ['Corporations'])
    t.setColor(game, 'micah', 'blue', ['Rocketry'])
    t.setHand(game, 'micah', ['Empiricism'])
    game.run()

    t.meld(game, 'Empiricism')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Universe'])
  })
})
