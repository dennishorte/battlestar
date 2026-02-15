const t = require('../../../testutil_v2.js')

describe('Home Brewer', () => {
  // Card text: "After the field phase of each harvest, you can turn exactly
  // 1 grain into your choice of 3 food or 1 bonus point."

  test('card exists and has onFieldPhaseEnd hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['home-brewer-c110'],
      },
    })
    game.run()

    const card = game.cards.byId('home-brewer-c110')
    expect(card).toBeTruthy()
    expect(card.hasHook('onFieldPhaseEnd')).toBe(true)
  })
})
