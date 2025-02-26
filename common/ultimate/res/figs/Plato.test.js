const t = require('../../testutil.js')

describe('Plato', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Plato', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Mathematics', 'Tools'])
      t.setColor(game, 'dennis', 'purple', ['Plato', 'Mysticism'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.purple')
    const request3 = t.choose(game, request2, 'blue')

    expect(t.zone(game, 'blue').splay).toBe('left')
  })

  test('karma: decree', () => {
    t.testDecreeForTwo('Plato', 'Rivalry')
  })

  test('karma: biscuits', () => {
    const game = t.fixtureTopCard('Plato', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Mathematics', 'Tools'])
      t.setColor(game, 'dennis', 'purple', ['Plato', 'Mysticism'])
      t.setColor(game, 'dennis', 'yellow', ['Canning', 'Statistics'])

      t.setSplay(game, 'dennis', 'blue', 'left')
      t.setSplay(game, 'dennis', 'yellow', 'up')
    })
    const request1 = game.run()
    const biscuits = game.getBiscuits()
    expect(biscuits.dennis).toEqual({
      c: 1 + 2,
      f: 2,
      i: 0,
      k: 1 + 2,
      l: 2 + 2,
      s: 5 + 2,
    })
  })
})
