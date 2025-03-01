const t = require('../../../testutil.js')

test('Trade', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'yellow', ['Sunshu Ao', 'Software'])
    t.setColor(game, 'dennis', 'purple', ['Reformation'])
  })
  let request
    request = game.run()
  request = t.choose(game, request, 'Decree.Trade')

  const ages = t.zone(game, 'forecast').cards().map(c => c.age).sort()
  expect(ages).toStrictEqual([5, 5, 5])
})
