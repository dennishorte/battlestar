const t = require('../../../testutil_v2.js')

describe('Wooden Hut Extender', () => {
  // Card text: "Wood rooms now cost you 1 reed, and additionally 5/4/3 wood
  // based on the round."

  test('card exists and has modifyRoomCost hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['wooden-hut-extender-c128'],
      },
    })
    game.run()

    const card = game.cards.byId('wooden-hut-extender-c128')
    expect(card).toBeTruthy()
    expect(card.hasHook('modifyRoomCost')).toBe(true)
  })
})
