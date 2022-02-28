Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Adam Smith', () => {
  test('inspire', () => {
    const game = t.fixtureTopCard('Adam Smith', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Tools', 'Writing'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Inspire.green')
    const request3 = t.choose(game, request2, 'blue')
    expect(t.zone(game, 'blue').splay).toBe('right')
  })

  test('karma', () => {
    const game = t.fixtureTopCard('Adam Smith', { expansions: ['base', 'figs'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'blue', ['Writing'])
    })
    const request1 = game.run()

    expect(game.getBiscuitsByPlayer(t.dennis(game)).c).toBe(9)
  })
})
