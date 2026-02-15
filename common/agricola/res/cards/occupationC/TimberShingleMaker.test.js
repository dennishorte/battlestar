const t = require('../../../testutil_v2.js')

describe('Timber Shingle Maker', () => {
  // Card text: "When you renovate to stone, you can place wood in rooms.
  // Each such wood is worth 1 BP during scoring."

  test('card exists and has correct hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['timber-shingle-maker-c132'],
      },
    })
    game.run()

    const card = game.cards.byId('timber-shingle-maker-c132')
    expect(card).toBeTruthy()
    expect(card.hasHook('onRenovate')).toBe(true)
    expect(card.hasHook('getEndGamePoints')).toBe(true)
  })
})
