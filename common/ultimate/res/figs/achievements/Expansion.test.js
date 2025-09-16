const t = require('../../../testutil.js')

test('Expansion', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'yellow', ['Statistics', 'Masonry'])
  })
  let request
  request = game.run()
  request = t.choose(game, request, 'Decree.Expansion')

  expect(t.zone(game, 'yellow').splay).toBe('up')
})
