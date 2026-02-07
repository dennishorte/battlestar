const t = require('../../../testutil.js')

describe('Chain Float (B020)', () => {
  test('schedules fields for rounds +7, +8, +9', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        wood: 3,
        hand: ['chain-float-b020'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'chain-float-b020')

    const dennis = t.player(game)
    // Rounds 10, 11, 12 (3+7, 3+8, 3+9)
    expect(game.state.scheduledPlows[dennis.name]).toContain(10)
    expect(game.state.scheduledPlows[dennis.name]).toContain(11)
    expect(game.state.scheduledPlows[dennis.name]).toContain(12)
  })
})
