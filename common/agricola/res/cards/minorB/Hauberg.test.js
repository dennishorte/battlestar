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

    // Default round is 2 with actionSpaces; schedules for rounds 3, 4, 5, 6
    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['hauberg-b041'],
        scheduled: {
          wood: { 3: 2, 5: 2 },
          boar: { 4: 1, 6: 1 },
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
          wood: { 4: 2, 6: 2 },
          boar: { 3: 1, 5: 1 },
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
      actionSpaces: ['Major Improvement'],
    })
    // Force round to 12 so scheduling starts from round 13
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.round = 12
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Hauberg')
    t.choose(game, 'Start with wood')

    // Round 13: schedules for rounds 14 only (15 and 16 exceed game end)
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
