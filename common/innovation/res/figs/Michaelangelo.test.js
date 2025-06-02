Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Michaelangelo', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Michaelangelo', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'dennis', ['Tools', 'Construction'])
      t.setHand(game, 'dennis', ['Sailing', 'Al-Kindi'])
      t.setDeckTop(game, 'base', 4, ['Enterprise'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.yellow')
    const request3 = t.choose(game, request2, 'Al-Kindi')
    expect(t.cards(game, 'score').sort()).toEqual([
      'Al-Kindi',
      'Construction',
      'Enterprise',
      'Sailing',
      'Tools',
    ])
    expect(t.cards(game, 'hand').sort()).toEqual(['Enterprise', 'Sailing'])
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Michaelangelo', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'dennis', ['Tools', 'Construction'])
      t.setHand(game, 'dennis', ['Sailing', 'Al-Kindi'])
    })
    const request1 = game.run()

    expect(t.cards(game, 'score').sort()).toEqual([
      'Al-Kindi',
      'Construction',
      'Sailing',
      'Tools',
    ])
    expect(game.getScore(t.dennis(game))).toBe(7)
  })
})
