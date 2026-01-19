Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Flight', () => {
  test('red is not splayed up', () => {
    const game = t.fixtureTopCard('Flight')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight', 'Archery'])
      t.setColor(game, 'dennis', 'blue', ['Experimentation', 'Writing'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flight')
    t.choose(game, request, 'red')

    const red = game.zones.byPlayer(t.dennis(game), 'red')
    expect(red.splay).toBe('up')
  })

  test('red is splayed up', () => {
    const game = t.fixtureTopCard('Flight')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight', 'Archery'])
      t.setColor(game, 'dennis', 'blue', ['Experimentation', 'Writing'])
      t.setSplay(game, 'dennis', 'red', 'up')
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Flight')
    t.choose(game, request, 'blue')

    const blue = game.zones.byPlayer(t.dennis(game), 'blue')
    expect(blue.splay).toBe('up')
  })
})
