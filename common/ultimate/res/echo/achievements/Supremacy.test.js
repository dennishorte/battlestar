Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

describe('Supremacy Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
      t.setHand(game, 'dennis', ['Mysticism'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Mysticism')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Supremacy'])
  })
})
