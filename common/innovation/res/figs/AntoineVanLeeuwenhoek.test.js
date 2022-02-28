Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Avicenna', () => {
  test('echo', () => {
    const game = t.fixtureTopCard('Antoine Van Leeuwenhoek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 6, ['Canning'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Antoine Van Leeuwenhoek')

    t.testZone(game, 'hand', ['Canning'])
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Antoine Van Leeuwenhoek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Engineering', 'Colonialism'])
      t.setScore(game, 'dennis', ['Statistics'])
      t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery', 'Reformation'])
    })
    const request1 = game.run()

    t.testActionChoices(request1, 'Achieve', ['age 1', 'age 3'])
  })
})
