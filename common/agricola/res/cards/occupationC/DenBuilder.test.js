const t = require('../../../testutil_v2.js')

describe('Den Builder', () => {
  // Card text: "When you live in a clay or stone house, pay 1 grain and 2 food
  // for this card to provide room for one person."

  test('card exists and has room provision hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['den-builder-c085'],
      },
    })
    game.run()

    const card = game.cards.byId('den-builder-c085')
    expect(card).toBeTruthy()
    expect(card.hasHook('canActivateRoom')).toBe(true)
    expect(card.hasHook('activateRoom')).toBe(true)
  })
})
