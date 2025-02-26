Error.stackTraceLimit = 100

const t = require('../../../testutil.js')

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
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Meld.Empiricism')

    expect(t.cards(game, 'achievements')).toStrictEqual(['Universe'])
  })
})
