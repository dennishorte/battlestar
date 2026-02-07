const t = require('../../../testutil.js')

describe('Private Forest (C074)', () => {
  test('schedules wood for even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorC'] })
    t.setBoard(game, {
      dennis: {
        food: 2,
        hand: ['private-forest-c074'],
        occupations: ['wood-cutter'],
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'private-forest-c074')

    const dennis = t.player(game)
    // Even rounds after 5: 6, 8, 10, 12, 14
    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
  })
})
