Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Metalworking', () => {
  test('dogma', () => {
    const game = t.fixtureTopCard('Metalworking')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setDeckTop(game, 'base', 1, ['Mysticism', 'Masonry', 'Clothing'])
      t.setHand(game, 'dennis', [])
    })

    const request1 = game.run()
    t.choose(game, request1, 'Dogma.Metalworking')

    const dennis = game.players.byName('dennis')
    const score = game.getZoneByPlayer(dennis, 'score').cards().map(c => c.name).sort()
    const hand = game.getZoneByPlayer(dennis, 'hand').cards().map(c => c.name).sort()
    expect(score).toEqual(['Masonry', 'Mysticism'])
    expect(hand).toEqual(['Clothing'])
  })
})
