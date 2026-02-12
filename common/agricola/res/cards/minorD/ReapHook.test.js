const t = require('../../../testutil_v2.js')

describe('Reap Hook', () => {
  test('schedules grain on next 3 harvest rounds', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reap-hook-d067'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reap Hook')

    // Harvest rounds after 1: [4, 7, 9, 11, 13, 14] → first 3: 4, 7, 9
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['reap-hook-d067'],
        scheduled: {
          grain: { 4: 1, 7: 1, 9: 1 },
        },
      },
    })
  })

  test('schedules grain on next 3 harvest rounds from round 8', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reap-hook-d067'],
        wood: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Reap Hook')

    // Harvest rounds after 8: [9, 11, 13, 14] → first 3: 9, 11, 13
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['reap-hook-d067'],
        scheduled: {
          grain: { 9: 1, 11: 1, 13: 1 },
        },
      },
    })
  })
})
