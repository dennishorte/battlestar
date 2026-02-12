const t = require('../../../testutil_v2.js')

describe('Syrup Tap', () => {
  test('schedules 1 food on next round when getting wood', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['syrup-tap-e047'],
      },
    })
    game.run()

    // Forest gives wood → Syrup Tap schedules 1 food on round 2
    t.choose(game, 'Forest')  // dennis

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 3,
        minorImprovements: ['syrup-tap-e047'],
        scheduled: {
          food: { 2: 1 },
        },
      },
    })
  })
})
