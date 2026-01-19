import t from '../../../testutil.js'

test('War', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'purple', ['Education'])
    t.setColor(game, 'micah', 'yellow', ['Machinery', 'Medicine'])
    t.setColor(game, 'micah', 'blue', ['Mathematics', 'Alchemy'])
    t.setColor(game, 'scott', 'red', ['Optics'])
    t.setColor(game, 'scott', 'green', ['Databases'])
  })
  let request
  request = game.run()
  request = t.choose(game, request, 'Decree.War')
  request = t.choose(game, request, 3)
  request = t.choose(game, request, 'auto')

  expect(t.cards(game, 'purple', 'dennis')).toStrictEqual(['Education'])
  expect(t.cards(game, 'yellow', 'micah')).toStrictEqual(['Medicine'])
  expect(t.cards(game, 'blue', 'micah')).toStrictEqual(['Mathematics', 'Alchemy'])
  expect(t.cards(game, 'red', 'scott')).toStrictEqual([])
  expect(t.cards(game, 'green', 'scott')).toStrictEqual(['Databases'])
})
