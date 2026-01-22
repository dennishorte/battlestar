Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

test('Advancement', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'red', ['Industrialization'])
    t.setColor(game, 'dennis', 'purple', ['Monotheism'])
    t.setDeckTop(game, 'base', 8, ['Flight'])
  })
  let request
  request = game.run()
  request = t.choose(game, 'Decree.Advancement')

  expect(t.cards(game, 'hand')).toStrictEqual(['Flight'])
})
