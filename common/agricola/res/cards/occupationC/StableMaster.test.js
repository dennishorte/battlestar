const t = require('../../../testutil_v2.js')

describe('Stable Master', () => {
  // Card text: "When you play this card, you can build 1 stable for 1 wood.
  // Exactly one of your unfenced stables can hold up to 3 animals."

  test('card exists and has correct hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['stable-master-c089'],
      },
    })
    game.run()

    const card = game.cards.byId('stable-master-c089')
    expect(card).toBeTruthy()
    expect(card.hasHook('onPlay')).toBe(true)
    expect(card.hasHook('modifyUnfencedStableCapacity')).toBe(true)
  })
})
