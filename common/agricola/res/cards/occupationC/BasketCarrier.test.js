const t = require('../../../testutil_v2.js')

describe('Basket Carrier', () => {
  // Card text: "Once each harvest, you can buy 1 wood, 1 reed, and 1 grain
  // for 2 food total."

  test('card exists and has onFieldPhaseEnd hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['basket-carrier-c105'],
      },
    })
    game.run()

    const card = game.cards.byId('basket-carrier-c105')
    expect(card).toBeTruthy()
    expect(card.hasHook('onFieldPhaseEnd')).toBe(true)
  })
})
