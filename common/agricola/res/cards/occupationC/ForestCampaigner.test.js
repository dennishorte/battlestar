const t = require('../../../testutil_v2.js')

describe('Forest Campaigner', () => {
  // Card text: "Each time before you place a person, if there are at least
  // 8 wood total on accumulation spaces, you get 1 food."
  // Note: onBeforePlacePerson hook is not fired by the engine.

  test('card exists and has onBeforePlacePerson hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['forest-campaigner-c158'],
      },
    })
    game.run()

    const card = game.cards.byId('forest-campaigner-c158')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBeforePlacePerson')).toBe(true)
  })
})
