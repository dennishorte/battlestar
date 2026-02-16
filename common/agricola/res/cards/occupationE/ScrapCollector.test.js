const t = require('../../../testutil_v2.js')

describe('Scrap Collector', () => {
  test('schedules alternating wood and clay for next 6 rounds when played in round 2', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['scrap-collector-e120'],
      },
    })
    game.run()

    // Play in round 2: schedules wood at 3,5,7 and clay at 4,6,8
    t.choose(game, 'Lessons A')
    t.choose(game, 'Scrap Collector')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['scrap-collector-e120'],
        scheduled: {
          wood: { 3: 1, 5: 1, 7: 1 },
          clay: { 4: 1, 6: 1, 8: 1 },
        },
      },
    })
  })

  test('schedules based on current round when played later', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['scrap-collector-e120'],
      },
    })
    game.run()

    // Play in round 4: schedules wood at 5,7,9 and clay at 6,8,10
    t.choose(game, 'Lessons A')
    t.choose(game, 'Scrap Collector')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['scrap-collector-e120'],
        scheduled: {
          wood: { 5: 1, 7: 1, 9: 1 },
          clay: { 6: 1, 8: 1, 10: 1 },
        },
      },
    })
  })
})
