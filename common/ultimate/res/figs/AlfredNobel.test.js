Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alfred Nobel', () => {

  test('karma', () => {
    const game = t.fixtureTopCard('Alfred Nobel', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
      t.setColor(game, 'dennis', 'blue', ['Writing'])

      t.setColor(game, 'micah', 'blue', ['Tools'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    let request
    request = game.run()

    const achs = game.getAchievementsByPlayer(t.dennis(game))
    expect(achs.total).toBe(2)
    expect(achs.other).toEqual([
      expect.objectContaining({ name: 'Alfred Nobel' }),
      expect.objectContaining({ name: 'Alfred Nobel' }),
    ])
  })
})
