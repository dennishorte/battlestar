const t = require('../../../testutil_v2.js')

describe('Well', () => {
  test('purchase and food delivery scheduled', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        wood: 1,
        stone: 3,
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Well (well)')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        stone: 0,
        majorImprovements: ['well'],
      },
    })

    // Well should have scheduled food for next 5 rounds
    expect(game.state.scheduledFood).toBeDefined()
    expect(game.state.scheduledFood['dennis']).toBeDefined()
    const scheduledRounds = Object.keys(game.state.scheduledFood['dennis']).map(Number).sort((a, b) => a - b)
    expect(scheduledRounds).toHaveLength(5)
    for (const round of scheduledRounds) {
      expect(game.state.scheduledFood['dennis'][round]).toBe(1)
    }
  })
})
