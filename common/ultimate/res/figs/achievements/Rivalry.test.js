const t = require('../../../testutil.js')

test('Rivalry', () => {
  const game = t.fixtureDecrees({ numPlayers: 3 })
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setScore(game, 'micah', ['Mathematics', 'Experimentation', 'Coal', 'Software'])
    t.setColor(game, 'micah', 'yellow', ['Sunshu Ao', 'Sneferu'])
    t.setColor(game, 'scott', 'yellow', ['Shennong'])
  })
  const request1 = game.run()
  const request2 = t.choose(game, request1, 'Decree.Rivalry')
  const request3 = t.choose(game, request2, 'micah')
  const request4 = t.choose(game, request3, 'Software', 'Coal', 'Mathematics')
  const request5 = t.choose(game, request4, 'auto')

  expect(t.cards(game, 'yellow', 'scott')).toStrictEqual(['Shennong'])
  expect(t.cards(game, 'yellow', 'micah')).toStrictEqual(['Sneferu'])
  expect(t.cards(game, 'score', 'micah')).toStrictEqual(['Experimentation'])
})
