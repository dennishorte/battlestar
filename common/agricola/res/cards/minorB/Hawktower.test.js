const t = require('../../../testutil_v2.js')

describe('Hawktower', () => {
  test('schedules free stone room for round 12', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hawktower-b014'],
        clay: 2, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hawktower')

    // Hawktower uses custom state, not standard scheduling
    expect(game.state.hawktowerRooms).toBeDefined()
    expect(game.state.hawktowerRooms.dennis).toBe(12)

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        minorImprovements: ['hawktower-b014'],
      },
    })
  })
})
