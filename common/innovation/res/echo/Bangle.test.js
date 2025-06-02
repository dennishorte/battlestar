Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bangle', () => {
  test('echo and dogma', () => {
    const game = t.fixtureTopCard('Bangle', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Philosophy'])
      t.setDeckTop(game, 'echo', 2, ['Toothbrush'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Bangle')

    expect(t.cards(game, 'red')).toEqual(['Bangle', 'Archery'])
    expect(t.cards(game, 'forecast')).toEqual(['Toothbrush'])
  })
})
