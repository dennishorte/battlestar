Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Flight', () => {
  test('red is not splayed up', () => {
    const game = t.fixtureTopCard('Flight')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight', 'Archery'])
      t.setColor(game, 'dennis', 'blue', ['Experimentation', 'Writing'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Flight')
    t.choose(game, request2, 'red')

    const red = game.getZoneByPlayer(t.dennis(game), 'red')
    expect(red.splay).toBe('up')
  })

  test('red is splayed up', () => {
    const game = t.fixtureTopCard('Flight')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight', 'Archery'])
      t.setColor(game, 'dennis', 'blue', ['Experimentation', 'Writing'])
      t.setSplay(game, 'dennis', 'red', 'up')
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Flight')
    t.choose(game, request2, 'blue')

    const blue = game.getZoneByPlayer(t.dennis(game), 'blue')
    expect(blue.splay).toBe('up')
  })
})
