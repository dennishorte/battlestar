Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

test('Advancement', () => {
  const game = t.fixtureDecrees()
  game.testSetBreakpoint('before-first-player', (game) => {
    t.setColor(game, 'dennis', 'red', ['Industrialization'])
    t.setColor(game, 'dennis', 'purple', ['Monotheism'])
    t.setDeckTop(game, 'base', 8, ['Flight'])
  })
  const request1 = game.run()
  const request2 = t.choose(game, request1, 'Decree.Advancement')
  const request3 = t.choose(game, request2, 'auto')

  expect(t.cards(game, 'hand')).toStrictEqual(['Flight'])
})
