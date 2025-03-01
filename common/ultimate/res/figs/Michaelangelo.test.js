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
    let request
    request = game.run()
    request = t.choose(game, request, 'Inspire.yellow')
    request = t.choose(game, request, 'Al-Kindi')
    expect(t.cards(game, 'score').sort()).toStrictEqual([
      'Al-Kindi',
      'Construction',
      'Enterprise',
      'Sailing',
      'Tools',
    ])
    expect(t.cards(game, 'hand').sort()).toStrictEqual(['Enterprise', 'Sailing'])
  })

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
