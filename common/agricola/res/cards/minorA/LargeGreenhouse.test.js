const t = require('../../../testutil.js')

describe('Large Greenhouse (A069)', () => {
  test('schedules vegetables for rounds current+4, +7, +9', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        wood: 5,
        hand: ['large-greenhouse-a069'],
        occupations: ['wood-cutter', 'firewood-collector'], // Need 2 occupations
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'large-greenhouse-a069')

    const dennis = t.player(game)
    // Should schedule vegetables for rounds 7, 10, 12
    expect(game.state.scheduledVegetables[dennis.name][7]).toBe(1)
    expect(game.state.scheduledVegetables[dennis.name][10]).toBe(1)
    expect(game.state.scheduledVegetables[dennis.name][12]).toBe(1)
  })
})
