const t = require('../../../testutil_v2.js')

describe('Hauberg', () => {
  test('schedules alternating wood and boar starting with wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        food: 3,
        hand: ['hauberg-b041'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Hauberg')
    t.choose(game, 'Start with wood')

    // actionSpaces plays round 1; schedules for rounds 2, 3, 4, 5
    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['hauberg-b041'],
        scheduled: {
          wood: { 2: 2, 4: 2 },
          boar: { 3: 1, 5: 1 },
        },
      },
    })
  })

  test('schedules alternating boar and wood starting with boar', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        food: 3,
        hand: ['hauberg-b041'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
      actionSpaces: ['Major Improvement'],
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Hauberg')
    t.choose(game, 'Start with boar')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['hauberg-b041'],
        scheduled: {
          wood: { 3: 2, 5: 2 },
          boar: { 2: 1, 4: 1 },
        },
      },
    })
  })

  test('does not schedule past round 14', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        food: 3,
        hand: ['hauberg-b041'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
      round: 13,
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Hauberg')
    t.choose(game, 'Start with wood')

    // Round 13: schedules for round 14 only (15 and 16 exceed game end)
    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['hauberg-b041'],
        scheduled: {
          wood: { 14: 2 },
        },
      },
    })
  })
})
