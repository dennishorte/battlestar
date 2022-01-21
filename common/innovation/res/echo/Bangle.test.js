Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bangle', () => {
  test('echo and dogma', () => {
    const game = t.fixtureDogma('Bangle', { expansions: ['base', 'echo'] })
    t.setHand(game, 'micah', ['Archery', 'Philosophy'])
    t.topDeck(game, 'echo', 2, ['Toothbrush'])
    game.run()
    t.dogma(game, 'Bangle')

    expect(game.getForecast('micah').cards).toStrictEqual(['Toothbrush'])
    expect(game.getZoneColorByPlayer('micah', 'red').cards).toStrictEqual(['Bangle', 'Archery'])
  })
})
