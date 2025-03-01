const t = require('../../../testutil.js')

test('Rivalry', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setScore(game, 'micah', ['Mathematics', 'Experimentation', 'Coal', 'Software'])
    t.setColor(game, 'micah', 'yellow', ['Sunshu Ao', 'Sneferu'])
    t.setColor(game, 'scott', 'yellow', ['Shennong'])
  })
  let request
    request = game.run()
  request = t.choose(game, request, 'Decree.Rivalry')
  request = t.choose(game, request, 'micah')
  request = t.choose(game, request, 'Software', 'Coal', 'Mathematics')
  request = t.choose(game, request, 'auto')

  expect(t.cards(game, 'yellow', 'scott')).toStrictEqual(['Shennong'])
  expect(t.cards(game, 'yellow', 'micah')).toStrictEqual(['Sneferu'])
  expect(t.cards(game, 'score', 'micah')).toStrictEqual(['Experimentation'])
})
