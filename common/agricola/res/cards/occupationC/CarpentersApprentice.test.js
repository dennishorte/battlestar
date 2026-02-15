const t = require('../../../testutil_v2.js')

describe("Carpenter's Apprentice", () => {
  // Card text: "Wood rooms cost you 2 woods less. Your 3rd and 4th stable
  // each cost you 1 wood less. Your 13th to 15th fence cost nothing."

  test('card exists and has cost modifier hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
      },
    })
    game.run()

    const card = game.cards.byId('carpenters-apprentice-c088')
    expect(card).toBeTruthy()
    expect(card.hasHook('modifyRoomCost')).toBe(true)
    expect(card.hasHook('modifyStableCost')).toBe(true)
    expect(card.hasHook('modifyFenceCost')).toBe(true)
  })
})
