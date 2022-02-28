const t = require('../../../testutil.js')

test('Trade', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'yellow', ['Sunshu Ao', 'Software'])
    t.setColor(game, 'dennis', 'purple', ['Reformation'])
  })
  const request1 = game.run()
  const request2 = t.choose(game, request1, 'Decree.Trade')
  const request3 = t.choose(game, request2, 'auto')

  const ages = t.zone(game, 'forecast').cards().map(c => c.age).sort()
  expect(ages).toStrictEqual([5, 5, 5])
})
