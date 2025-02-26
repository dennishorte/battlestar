const t = require('../../../testutil.js')

test('War', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'purple', ['Education'])
    t.setColor(game, 'micah', 'yellow', ['Machinery', 'Medicine'])
    t.setColor(game, 'micah', 'blue', ['Mathematics', 'Alchemy'])
    t.setColor(game, 'scott', 'red', ['Optics'])
    t.setColor(game, 'scott', 'green', ['Databases'])
  })
  const request1 = game.run()
  const request2 = t.choose(game, request1, 'Decree.War')
  const request3 = t.choose(game, request2, 3)
  const request4 = t.choose(game, request3, 'auto')

  expect(t.cards(game, 'purple', 'dennis')).toStrictEqual(['Education'])
  expect(t.cards(game, 'yellow', 'micah')).toStrictEqual(['Medicine'])
  expect(t.cards(game, 'blue', 'micah')).toStrictEqual(['Mathematics', 'Alchemy'])
  expect(t.cards(game, 'red', 'scott')).toStrictEqual([])
  expect(t.cards(game, 'green', 'scott')).toStrictEqual(['Databases'])
})
