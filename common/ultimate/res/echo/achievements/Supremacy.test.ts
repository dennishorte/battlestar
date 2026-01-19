Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Supremacy Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer({ expansions: ['base', 'echo'] })
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'green', ['The Wheel'])
      t.setColor(game, 'dennis', 'yellow', ['Masonry'])
      t.setColor(game, 'dennis', 'red', ['Metalworking'])
      t.setHand(game, 'dennis', ['Mysticism'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Mysticism')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Supremacy'])
  })
})
