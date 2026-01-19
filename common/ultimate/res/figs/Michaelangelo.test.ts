Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Michaelangelo', () => {

  test('karma', () => {
    const game = t.fixtureTopCard('Michaelangelo', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'dennis', ['Tools', 'Construction'])
      t.setHand(game, 'dennis', ['Sailing', 'Al-Kindi'])
    })
    let request
    request = game.run()

    expect(t.cards(game, 'score').sort()).toStrictEqual([
      'Al-Kindi',
      'Construction',
      'Sailing',
      'Tools',
    ])
    expect(game.getScore(t.dennis(game))).toBe(7)
  })
})
