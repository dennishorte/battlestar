const t = require('../../../testutil_v2.js')

describe('Parrot Breeder', () => {
  // Card text: "On your turn, if you pay 1 grain, you can use the same action
  // space that the player to your right just used."
  // Note: onTurnStart hook is not fired by the engine.

  test('card exists and has onTurnStart hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['parrot-breeder-c150'],
      },
    })
    game.run()

    const card = game.cards.byId('parrot-breeder-c150')
    expect(card).toBeTruthy()
    expect(card.hasHook('onTurnStart')).toBe(true)
  })
})
