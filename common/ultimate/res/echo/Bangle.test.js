Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Bangle', () => {
  test('echo and dogma', () => {
    const game = t.fixtureTopCard('Bangle', { expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Archery', 'Philosophy'])
      t.setDeckTop(game, 'echo', 2, ['Toothbrush'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Dogma.Bangle')

    expect(t.cards(game, 'red')).toStrictEqual(['Bangle', 'Archery'])
    expect(t.cards(game, 'forecast')).toStrictEqual(['Toothbrush'])
  })
})
