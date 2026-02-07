const t = require('../../../testutil.js')

describe('Sack Cart (B066)', () => {
  test('schedules grain for rounds 5, 8, 11, 14', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 2,
        hand: ['sack-cart-b066'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'sack-cart-b066')

    const dennis = t.player(game)
    expect(game.state.scheduledGrain[dennis.name][5]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][11]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][14]).toBe(1)
  })
})
