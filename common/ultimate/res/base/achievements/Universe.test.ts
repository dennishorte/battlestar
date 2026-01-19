Error.stackTraceLimit = 100

import t from '../../../testutil.js'

describe('Universe Achievement', () => {
  test('achieved', () => {
    const game = t.fixtureFirstPlayer()
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setColor(game, 'dennis', 'red', ['Flight'])
      t.setColor(game, 'dennis', 'yellow', ['Skyscrapers'])
      t.setColor(game, 'dennis', 'green', ['Corporations'])
      t.setColor(game, 'dennis', 'blue', ['Rocketry'])
      t.setHand(game, 'dennis', ['Empiricism'])
    })
    let request
    request = game.run()
    request = t.choose(game, request, 'Meld.Empiricism')

    expect(t.cards(game, 'achievements')).toEqual(['Universe'])
  })
})
