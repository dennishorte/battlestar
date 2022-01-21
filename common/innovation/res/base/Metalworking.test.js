Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Metalworking', () => {
  test('dogma', () => {
    const game = t.fixtureDogma('Metalworking')
    t.topDeck(game, 'base', 1, ['Mysticism', 'Masonry', 'Clothing'])
    t.setHand(game, 'micah', [])
    game.run()
    t.dogma(game, 'Metalworking')

    expect(game.getZoneScore('micah').cards).toStrictEqual(['Mysticism', 'Masonry'])
    expect(game.getHand('micah').cards).toStrictEqual(['Clothing'])
  })
})
