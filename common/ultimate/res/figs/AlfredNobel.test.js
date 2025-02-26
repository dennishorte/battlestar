Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Alfred Nobel', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Alfred Nobel', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Philosophy', 'Code of Laws'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'Philosophy')

    t.testZone(game, 'score', ['Philosophy'])
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Alfred Nobel', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
      t.setColor(game, 'dennis', 'blue', ['Writing'])

      t.setColor(game, 'micah', 'blue', ['Tools'])
      t.setColor(game, 'micah', 'red', ['Archery'])
    })
    const request1 = game.run()

    const achs = game.getAchievementsByPlayer(t.dennis(game))
    expect(achs.total).toBe(2)
    expect(achs.other).toEqual([
      expect.objectContaining({ name: 'Alfred Nobel' }),
      expect.objectContaining({ name: 'Alfred Nobel' }),
    ])
  })
})
