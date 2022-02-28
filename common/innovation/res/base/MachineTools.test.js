Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Machine Tools', () => {
  test('draw blue, green, other', () => {
    const game = t.fixtureTopCard('Machine Tools')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setScore(game, 'dennis', ['Machinery'])
      t.setDeckTop(game, 'base', 3, ['Engineering'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Machine Tools')

    t.testZone(game, 'score', ['Engineering', 'Machinery'], { sort: true })
  })

  test('nothing in score pile', () => {
    const game = t.fixtureTopCard('Machine Tools')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 1, ['Metalworking'])
    })
    const result1 = game.run()
    const result2 = t.choose(game, result1, 'Dogma.Machine Tools')

    t.testZone(game, 'score', ['Metalworking'])
  })
})
