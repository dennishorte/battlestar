const t = require('../../../testutil_v2.js')

describe('Spice Trader', () => {
  test('schedules 3 vegetables at round 11 when played in round 2 (round <= 4)', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['spice-trader-e104'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Spice Trader')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['spice-trader-e104'],
        scheduled: {
          vegetables: { 11: 3 },
        },
      },
    })
  })

  test('does not schedule vegetables when played after round 4', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['spice-trader-e104'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Spice Trader')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['spice-trader-e104'],
        scheduled: {},
      },
    })
  })
})
