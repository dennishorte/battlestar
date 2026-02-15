const t = require('../../../testutil_v2.js')

describe('Collector', () => {
  // Card text: "This card is an action space for you only. When you use it,
  // you get 1 begging marker and 6/7/8/9 different goods."

  test('card exists and has action space properties', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['collector-c104'],
      },
    })
    game.run()

    const card = game.cards.byId('collector-c104')
    expect(card).toBeTruthy()
    expect(card.definition.isActionSpace).toBe(true)
    expect(card.definition.actionSpaceForOwnerOnly).toBe(true)
    expect(card.hasHook('actionSpaceEffect')).toBe(true)
  })
})
