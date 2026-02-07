const t = require('../../../testutil.js')

describe('Granary (C065)', () => {
  test('schedules grain for rounds 8, 10, 12', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        wood: 3,
        hand: ['granary-c065'],
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'granary-c065')

    const dennis = t.player(game)
    expect(game.state.scheduledGrain[dennis.name][8]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][10]).toBe(1)
    expect(game.state.scheduledGrain[dennis.name][12]).toBe(1)
  })
})
