const t = require('../../../testutil_v2.js')

describe('Sowing Director', () => {
  // Card text: "Each time after another player uses the 'Grain Utilization'
  // action space, you get a 'Sow' action."

  test('card exists and has onAnyAction hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['sowing-director-c151'],
      },
    })
    game.run()

    const card = game.cards.byId('sowing-director-c151')
    expect(card).toBeTruthy()
    expect(card.hasHook('onAnyAction')).toBe(true)
  })
})
