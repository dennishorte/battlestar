const t = require('../../../testutil_v2.js')

describe('Forest Owner', () => {
  // Card text: "This card is an action space for all. If another player uses it,
  // they get 3 wood and give you 1 wood. If you use it, you get 4 wood."

  test('card exists and has action space properties', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['forest-owner-c162'],
      },
    })
    game.run()

    const card = game.cards.byId('forest-owner-c162')
    expect(card).toBeTruthy()
    expect(card.definition.isActionSpace).toBe(true)
    expect(card.definition.actionSpaceForAll).toBe(true)
    expect(card.hasHook('actionSpaceEffect')).toBe(true)
  })
})
