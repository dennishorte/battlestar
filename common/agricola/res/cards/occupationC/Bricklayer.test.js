const t = require('../../../testutil_v2.js')

describe('Bricklayer', () => {
  // Card text: "Each improvement and each renovation costs you 1 clay less.
  // Each room costs you 2 clay less."

  test('card exists and has cost modifier hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
      },
    })
    game.run()

    const card = game.cards.byId('bricklayer-c122')
    expect(card).toBeTruthy()
    expect(card.hasHook('modifyImprovementCost')).toBe(true)
    expect(card.hasHook('modifyRenovationCost')).toBe(true)
    expect(card.hasHook('modifyRoomCost')).toBe(true)
  })
})
