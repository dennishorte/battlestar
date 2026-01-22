Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Metalworking', () => {
  test('dogma', () => {
    const game = t.fixtureFirstPlayer()
    t.setBoard(game, {
      dennis: {
        red: ['Metalworking'],
      },
      decks: {
        base: {
          1: ['Mysticism', 'Masonry', 'Clothing'],
        },
      },
    })

    let request
    request = game.run()
    t.choose(game, 'Dogma.Metalworking')

    const dennis = game.players.byName('dennis')
    const score = game.zones.byPlayer(dennis, 'score').cardlist().map(c => c.name).sort()
    const hand = game.zones.byPlayer(dennis, 'hand').cardlist().map(c => c.name).sort()
    expect(score).toEqual(['Masonry', 'Mysticism'])
    expect(hand).toEqual(['Clothing'])
  })
})
