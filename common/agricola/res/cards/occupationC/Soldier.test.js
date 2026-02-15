const t = require('../../../testutil_v2.js')

describe('Soldier', () => {
  // Card text: "During scoring, you get 1 BP for each stone-wood pair in your supply."

  test('card exists and has getEndGamePoints hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['soldier-c133'],
      },
    })
    game.run()

    const card = game.cards.byId('soldier-c133')
    expect(card).toBeTruthy()
    expect(card.hasHook('getEndGamePoints')).toBe(true)
  })
})
