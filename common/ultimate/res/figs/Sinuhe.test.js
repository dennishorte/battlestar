Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Sinuhe', () => {
  test('decree karma', () => {
    t.testDecreeForTwo('Sinuhe', 'Rivalry')
  })

  test('score karma', () => {
    const game = t.fixtureTopCard('Sinuhe', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel', 'Mapmaking'])
      t.setColor(game, 'dennis', 'blue', ['Tools',])
      t.setSplay(game, 'dennis', 'green', 'up')
    })
    let request
    request = game.run()
    expect(t.dennis(game).score()).toBe(5)
  })
})
