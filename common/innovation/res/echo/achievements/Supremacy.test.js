Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Supremacy Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPicks({ expansions: ['base', 'echo'] })
    t.setColor(game, 'micah', 'green', ['The Wheel'])
    t.setColor(game, 'micah', 'yellow', ['Masonry'])
    t.setColor(game, 'micah', 'red', ['Metalworking'])
    t.setHand(game, 'micah', ['Mysticism'])
    game.run()
    t.meld(game, 'Mysticism')

    expect(game.getAchievements('micah').cards).toStrictEqual(['Supremacy'])
  })
})
