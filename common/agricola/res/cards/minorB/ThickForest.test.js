const t = require('../../../testutil.js')

describe('Thick Forest (B074)', () => {
  test('schedules wood for even-numbered rounds', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        clay: 5, // prereq
        hand: ['thick-forest-b074'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'thick-forest-b074')

    const dennis = t.player(game)
    // Even rounds after 3: 4, 6, 8, 10, 12, 14
    expect(game.state.scheduledWood[dennis.name][4]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][8]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][10]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][12]).toBe(1)
    expect(game.state.scheduledWood[dennis.name][14]).toBe(1)
  })
})
