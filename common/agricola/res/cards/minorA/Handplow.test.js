const t = require('../../../testutil.js')

describe('Handplow (A019)', () => {
  test('schedules a plow for round current+5', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        hand: ['handplow-a019'],
      },
      round: 3,
    })
    game.run()

    game.state.round = 3
    t.playCard(game, 'dennis', 'handplow-a019')

    const dennis = t.player(game)
    // Schedules plow for round 8
    expect(game.state.scheduledPlows[dennis.name]).toContain(8)
  })

  test('does not schedule beyond round 14', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        wood: 1,
        hand: ['handplow-a019'],
      },
      round: 10,
    })
    game.run()

    game.state.round = 10
    t.playCard(game, 'dennis', 'handplow-a019')

    // Round 10+5=15, which is beyond 14 so nothing scheduled
    expect(game.state.scheduledPlows).toBeUndefined()
  })
})
