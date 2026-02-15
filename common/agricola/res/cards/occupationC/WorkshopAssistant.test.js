const t = require('../../../testutil_v2.js')

describe('Workshop Assistant', () => {
  // Card text: "Place resource pairs on improvements. Each time another player
  // renovates, you may claim one pair."
  // Note: onAnyRenovate hook is not fired by engine.

  test('card exists and has correct hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['workshop-assistant-c146'],
      },
    })
    game.run()

    const card = game.cards.byId('workshop-assistant-c146')
    expect(card).toBeTruthy()
    expect(card.hasHook('onPlay')).toBe(true)
    expect(card.hasHook('onAnyRenovate')).toBe(true)
  })
})
