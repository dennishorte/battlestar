Error.stackTraceLimit = 100

const t = require('../../testutil.js')

describe('Agriculture', () => {
  test('return a card', () => {
    const game = t.fixtureTopCard('Agriculture')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Domestication'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Agriculture')
    t.choose(game, request2, 'Domestication')

    const dennis = game.players.byName('dennis')
    expect(game.getScore(dennis)).toBe(2)
  })

  test('do not return a card', () => {
    const game = t.fixtureTopCard('Agriculture')
    game.testSetBreakpoint('before-first-player', (game) => {
      t.setHand(game, 'dennis', ['Domestication'])
    })
    const request1 = game.run()
    const request2 = t.choose(game, request1, 'Dogma.Agriculture')
    t.choose(game, request2)

    const dennis = game.players.byName('dennis')
    expect(game.getScore(dennis)).toBe(0)
  })
})
