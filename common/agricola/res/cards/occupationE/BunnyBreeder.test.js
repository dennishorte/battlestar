const t = require('../../../testutil_v2.js')

describe('Bunny Breeder', () => {
  test('schedules food for a future round when played', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bunny-breeder-e139'],
      },
    })
    game.run()

    // Play Bunny Breeder in round 2
    t.choose(game, 'Lessons A')
    t.choose(game, 'Bunny Breeder')
    // Select round 5 → food = 5 - 2 = 3
    t.choose(game, 'Round 5 (3 food)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['bunny-breeder-e139'],
        scheduled: {
          food: { 5: 3 },
        },
      },
    })
  })

  test('can select different future rounds for different food amounts', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bunny-breeder-e139'],
      },
    })
    game.run()

    // Play in round 2, select round 10 → food = 10 - 2 = 8
    t.choose(game, 'Lessons A')
    t.choose(game, 'Bunny Breeder')
    t.choose(game, 'Round 10 (8 food)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['bunny-breeder-e139'],
        scheduled: {
          food: { 10: 8 },
        },
      },
    })
  })

  test('scheduled food is delivered at the start of the chosen round', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bunny-breeder-e139'],
      },
    })
    game.run()

    // Play in round 2, select round 3 → food = 3 - 2 = 1
    t.choose(game, 'Lessons A')
    t.choose(game, 'Bunny Breeder')
    t.choose(game, 'Round 3 (1 food)')

    // Finish round 2
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 3 starts — scheduled food delivered
    t.testBoard(game, {
      round: 3,
      dennis: {
        food: 3, // 2 (Day Laborer) + 1 (scheduled Bunny Breeder)
        occupations: ['bunny-breeder-e139'],
      },
    })
  })
})
