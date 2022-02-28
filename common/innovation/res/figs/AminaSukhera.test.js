Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Amina Sukhera', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Amina Sukhera', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'purple', ['Enterprise'])
      t.setColor(game, 'micah', 'purple', ['City States', 'Code of Laws'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.red')
    const request3 = t.choose(game, request2, 'auto')

    t.testZone(game, 'score', ['Enterprise', 'Code of Laws'], { sort: true })
  })

  test('karma: when-meld', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Amina Sukhera'])
      t.setColor(game, 'dennis', 'purple', ['Niccolo Machiavelli'])
      t.setColor(game, 'micah', 'purple', ['Al-Kindi'])
      t.setColor(game, 'micah', 'yellow', ['Michaelangelo'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Amina Sukhera')

    t.testZone(game, 'score', ['Michaelangelo'])
  })

  test('karma: list-achievements', () => {
    const game = t.fixtureTopCard('Amina Sukhera', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setAvailableAchievements(game, ['Code of Laws'])
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Fermenting'])
      t.setScore(game, 'dennis', ['Statistics'])
    })
    const request1 = game.run()

    t.testActionChoices(request1, 'Achieve', ['age 1', 'The Wheel'])
  })
})
