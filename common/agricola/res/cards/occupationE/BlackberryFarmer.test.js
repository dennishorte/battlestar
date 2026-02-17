const t = require('../../../testutil_v2.js')

describe('Blackberry Farmer', () => {
  test('schedules food for future rounds equal to fences built', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Fencing'],
      dennis: {
        occupations: ['blackberry-farmer-e108'],
        wood: 4, // 4 fences for 1-space pasture at corner
      },
    })
    game.run()

    // Build a 1-space pasture at corner (0,4) → 4 fences
    // Round 1: schedules food for rounds 2,3,4,5 (4 fences → 4 food)
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        occupations: ['blackberry-farmer-e108'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
        scheduled: {
          food: { 2: 1, 3: 1, 4: 1, 5: 1 },
        },
      },
    })
  })

  test('caps food scheduling at remaining round spaces', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['blackberry-farmer-e108'],
        wood: 4, // 4 fences
      },
    })
    game.run()

    // Build a 1-space pasture → 4 fences
    // Round 12: only rounds 13,14 remaining → only 2 food scheduled
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    t.action(game, 'done-building-pastures')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        occupations: ['blackberry-farmer-e108'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
        scheduled: {
          food: { 13: 1, 14: 1 },
        },
      },
    })
  })
})
