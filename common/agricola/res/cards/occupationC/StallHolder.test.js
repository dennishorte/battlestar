const t = require('../../../testutil_v2.js')

describe('Stall Holder', () => {
  // Card text: "Once per round, you can exchange 2 grain for 1 BP and food
  // based on unfenced stables."

  test('card exists and has exchange hooks', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['stall-holder-c101'],
      },
    })
    game.run()

    const card = game.cards.byId('stall-holder-c101')
    expect(card).toBeTruthy()
    expect(card.hasHook('canExchange')).toBe(true)
    expect(card.hasHook('doExchange')).toBe(true)
  })
})
