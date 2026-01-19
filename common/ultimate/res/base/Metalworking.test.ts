Error.stackTraceLimit = 100

import t from '../../testutil.js'

describe('Metalworking', () => {
  test('dogma', () => {
    const game = t.fixtureTopCard('Metalworking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 1, ['Mysticism', 'Masonry', 'Clothing'])
      t.setHand(game, 'dennis', [])
    })

    let request
    request = game.run()
    t.choose(game, request, 'Dogma.Metalworking')

    const dennis = game.players.byName('dennis')
    const score = game.zones.byPlayer(dennis, 'score').cardlist().map(c => c.name).sort()
    const hand = game.zones.byPlayer(dennis, 'hand').cardlist().map(c => c.name).sort()
    expect(score).toEqual(['Masonry', 'Mysticism'])
    expect(hand).toEqual(['Clothing'])
  })
})
