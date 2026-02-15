const t = require('../../../testutil_v2.js')

describe('Seed Researcher', () => {
  // Card text: "Each time any people return from both 'Grain Seeds' and
  // 'Vegetable Seeds' action spaces, you get 2 food and can play 1 occupation."

  test('card exists and has correct hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['seed-researcher-c097'],
      },
    })
    game.run()

    const card = game.cards.byId('seed-researcher-c097')
    expect(card).toBeTruthy()
    expect(card.hasHook('onReturnHomeStart')).toBe(true)
  })
})
