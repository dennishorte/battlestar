const t = require('../../../testutil_v2.js')

describe('Resource Analyzer', () => {
  // Card text: "Before the start of each round, if you have more building
  // resources than all other players of at least two types, you get 1 food."
  // Note: onBeforeRoundStart hook is not fired by the engine.

  test('card exists and has onBeforeRoundStart hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['resource-analyzer-c157'],
      },
    })
    game.run()

    const card = game.cards.byId('resource-analyzer-c157')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBeforeRoundStart')).toBe(true)
  })
})
