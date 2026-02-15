const t = require('../../../testutil_v2.js')

describe('Schnapps Distiller', () => {
  // Card text: "In the feeding phase of each harvest, you can turn exactly
  // 1 vegetable into 5 food."

  test('card exists and has onFeedingPhase hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['schnapps-distiller-c109'],
      },
    })
    game.run()

    const card = game.cards.byId('schnapps-distiller-c109')
    expect(card).toBeTruthy()
    expect(card.hasHook('onFeedingPhase')).toBe(true)
  })
})
