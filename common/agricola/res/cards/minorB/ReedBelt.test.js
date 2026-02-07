const t = require('../../../testutil.js')

describe('Reed Belt (B078)', () => {
  test('schedules reed for rounds 5, 8, 10, 12', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 2,
        hand: ['reed-belt-b078'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'reed-belt-b078')

    const dennis = t.player(game)
    expect(game.state.scheduledReed[dennis.name][5]).toBe(1)
    expect(game.state.scheduledReed[dennis.name][8]).toBe(1)
    expect(game.state.scheduledReed[dennis.name][10]).toBe(1)
    expect(game.state.scheduledReed[dennis.name][12]).toBe(1)
  })
})
