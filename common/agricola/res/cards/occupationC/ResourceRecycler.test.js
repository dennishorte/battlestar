const t = require('../../../testutil_v2.js')

describe('Resource Recycler', () => {
  // Card text: "Each time another player renovates to stone, if you live in
  // a clay house, you can pay 2 food to build a clay room at no cost."

  test('card exists and has onAnyRenovateToStone hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['resource-recycler-c149'],
      },
    })
    game.run()

    const card = game.cards.byId('resource-recycler-c149')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyRenovateToStone')).toBe(true)
  })
})
