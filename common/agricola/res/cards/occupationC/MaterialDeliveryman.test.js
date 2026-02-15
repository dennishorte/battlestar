const t = require('../../../testutil_v2.js')

describe('Material Deliveryman', () => {
  // Card text: "Each time any player (including you) takes 5/6/7/8+ goods
  // from an accumulation space, you get 1 wood/clay/reed/stone."

  test('card exists and has onAnyAction hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['material-deliveryman-c163'],
      },
    })
    game.run()

    const card = game.cards.byId('material-deliveryman-c163')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyAction')).toBe(true)
  })
})
