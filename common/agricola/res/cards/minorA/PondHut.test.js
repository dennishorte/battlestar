const t = require('../../../testutil.js')

describe('Pond Hut (A044)', () => {
  test('schedules 1 food for next 3 rounds', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        wood: 5,
        hand: ['pond-hut-a044'],
        occupations: ['wood-cutter', 'firewood-collector'], // Need exactly 2 occupations
      },
      round: 5,
    })
    game.run()

    game.state.round = 5
    t.playCard(game, 'dennis', 'pond-hut-a044')

    const dennis = t.player(game)
    // Should schedule food for rounds 6, 7, 8
    expect(game.state.scheduledFood[dennis.name][6]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][7]).toBe(1)
    expect(game.state.scheduledFood[dennis.name][8]).toBe(1)
  })
})
