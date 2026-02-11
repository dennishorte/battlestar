const t = require('../../../testutil_v2.js')

describe('Ceilings', () => {
  test('schedules 1 wood on each of the next 5 rounds', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['ceilings-b076'],
        clay: 1, // card cost
        occupations: ['test-occupation-1'], // prereq: 1 occupation
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ceilings')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        scheduled: { wood: { 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 } },
        occupations: ['test-occupation-1'],
        minorImprovements: ['ceilings-b076'],
      },
    })
  })

  test('renovation removes all scheduled wood', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        hand: ['ceilings-b076'],
        clay: 3, // 1 for Ceilings + 2 for renovation
        reed: 1, // for renovation
        occupations: ['test-occupation-1'],
      },
    })
    game.run()

    // Dennis plays Ceilings (schedules wood on future rounds)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Ceilings')
    // Micah takes action
    t.choose(game, 'Forest')
    // Dennis renovates — onRenovate fires, clears scheduled wood
    t.choose(game, 'House Redevelopment')
    // No affordable improvements after spending resources, step auto-skipped
    // Micah takes last action
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        food: 1, // from Meeting Place
        scheduled: { wood: {} }, // all cleared after renovation
        occupations: ['test-occupation-1'],
        minorImprovements: ['ceilings-b076'],
      },
    })
  })
})
