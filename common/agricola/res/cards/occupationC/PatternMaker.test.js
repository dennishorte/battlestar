const t = require('../../../testutil_v2.js')

describe('Pattern Maker', () => {
  // Card text: "Each time another player renovates, you can exchange
  // 2 wood for 1 grain, 1 food, and 1 bonus point."
  // Note: onAnyRenovate hook is not fired by engine.

  test('card exists and has onAnyRenovate hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pattern-maker-c153'],
      },
    })
    game.run()

    const card = game.cards.byId('pattern-maker-c153')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyRenovate')).toBe(true)
  })
})
