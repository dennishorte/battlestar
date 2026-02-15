const t = require('../../../testutil_v2.js')

describe('Small Animal Breeder', () => {
  // Card text: "Before the start of each round, if you have food >= current
  // round number, you get 1 food."
  // Note: onBeforeRoundStart hook is not fired by the engine.

  test('card exists and has onBeforeRoundStart hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['small-animal-breeder-c111'],
      },
    })
    game.run()

    const card = game.cards.byId('small-animal-breeder-c111')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBeforeRoundStart')).toBe(true)
  })
})
