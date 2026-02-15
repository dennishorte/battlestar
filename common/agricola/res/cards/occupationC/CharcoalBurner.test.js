const t = require('../../../testutil_v2.js')

describe('Charcoal Burner', () => {
  // Card text: "Each time any player (including you) plays or builds a baking
  // improvement, you get 1 wood and 1 food."
  // Note: onAnyBuildBakingImprovement hook is not fired by the engine.

  test('card exists and has correct hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['charcoal-burner-c137'],
      },
    })
    game.run()

    const card = game.cards.byId('charcoal-burner-c137')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyBuildBakingImprovement')).toBe(true)
  })
})
