Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Antoine Van Leeuwenhoek', () => {
  test('echo', () => {
    const game = t.fixtureTopCard('Antoine Van Leeuwenhoek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 6, ['Canning'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Antoine Van Leeuwenhoek')

    t.testZone(game, 'hand', ['Canning'])
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Antoine Van Leeuwenhoek', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Engineering', 'Colonialism'])
      t.setScore(game, 'dennis', ['Statistics'])
      t.setAvailableAchievements(game, ['The Wheel', 'Monotheism', 'Machinery', 'Reformation'])
    })
    let request
    request = game.run()

    t.testActionChoices(request, 'Achieve', ['age 1', 'age 3'])
  })
})
