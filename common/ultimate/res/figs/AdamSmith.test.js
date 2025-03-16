Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Adam Smith', () => {

  test('karma', () => {
    const game = t.fixtureTopCard('Adam Smith', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Writing'])
    })
    let request
    request = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).c).toBe(9)
  })
})
