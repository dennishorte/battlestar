const t = require('../../../testutil_v2.js')

describe('EducationBonus', () => {
  test('gives grain for 1st occupation', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
        hand: ['test-occupation-1'],
        food: 3,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 1st occupation → Education Bonus gives 1 grain
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')

    t.testBoard(game, {
      dennis: {
        grain: 1,
        food: 3, // Lessons A for 1st occ is free
        occupations: ['test-occupation-1'],
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
        hand: [],
      },
    })
  })

  test('gives clay for 2nd occupation', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
        occupations: ['test-occupation-1'],
        hand: ['test-occupation-2'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play 2nd occupation → clay
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 2')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        food: 9, // 10 - 1 for Lessons A
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
      },
    })
  })

  test('6th occupation plows a field', () => {
    const game = t.fixture({ numPlayers: 3, cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5'],
        hand: ['test-occupation-6'],
        food: 10,
      },
      micah: { food: 10 },
      scott: { food: 10 },
    })
    game.run()

    // Play 6th occ → plow a field
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 6')
    // Choose where to plow
    t.choose(game, '0,2')

    t.testBoard(game, {
      dennis: {
        food: 9, // 10 - 1 for Lessons A
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4', 'test-occupation-5', 'test-occupation-6'],
        minorImprovements: ['education-bonus-d042', 'test-minor-1', 'test-minor-2'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
