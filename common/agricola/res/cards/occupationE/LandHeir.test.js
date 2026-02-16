const t = require('../../../testutil_v2.js')

describe('Land Heir', () => {
  test('schedules 4 wood and 4 clay at round 9 when played in round 2 (round <= 4)', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['land-heir-e119'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Land Heir')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['land-heir-e119'],
        scheduled: {
          wood: { 9: 4 },
          clay: { 9: 4 },
        },
      },
    })
  })

  test('does not schedule resources when played after round 4', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['land-heir-e119'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Land Heir')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['land-heir-e119'],
        scheduled: {},
      },
    })
  })
})
