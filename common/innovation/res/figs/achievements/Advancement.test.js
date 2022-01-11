Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

test('Advancement', () => {
  const game = t.fixtureDecrees({ expansions: ['base', 'figs'] })
  game.run()
  jest.spyOn(game, 'aDraw')
  t.decree(game, 'Advancement')

  expect(game.aDraw).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ name: 'micah' }),
    3
  )
})
