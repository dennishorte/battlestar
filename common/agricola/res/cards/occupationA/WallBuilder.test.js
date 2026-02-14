const t = require('../../../testutil_v2.js')

describe('Wall Builder', () => {
  test('onBuildRoom schedules 1 food on each of the next 4 rounds', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      dennis: {
        occupations: ['wall-builder-a111'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // actionSpaces: ['Farm Expansion'] means round 1 (base action only)
    // Building on round 1 schedules food for rounds 2, 3, 4, 5
    t.testBoard(game, {
      dennis: {
        occupations: ['wall-builder-a111'],
        clay: 0, // 5 - 5
        reed: 0, // 2 - 2
        scheduled: { food: { 2: 1, 3: 1, 4: 1, 5: 1 } },
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not schedule food beyond round 14', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 12,
      dennis: {
        occupations: ['wall-builder-a111'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    // Farm Expansion is a base action, always available
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // Round 12: next 4 would be 13, 14, 15, 16 — only 13, 14 are valid
    t.testBoard(game, {
      dennis: {
        occupations: ['wall-builder-a111'],
        clay: 0,
        reed: 0,
        scheduled: { food: { 13: 1, 14: 1 } },
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('scheduled food is collected at start of next round', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farm Expansion', 'Forest', 'Day Laborer', 'Clay Pit'],
      dennis: {
        occupations: ['wall-builder-a111'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
        food: 0,
      },
    })
    game.run()

    // Round 1: dennis builds a room — schedules food for rounds 2, 3, 4, 5
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    // Complete round 1
    t.choose(game, 'Forest') // micah
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Clay Pit') // micah

    // Round 2 starts — food from round 2 schedule is collected
    // testBoard called mid-round 2 (after round start hooks, during work phase)
    t.testBoard(game, {
      dennis: {
        occupations: ['wall-builder-a111'],
        food: 3, // 2 from Day Laborer + 1 from scheduled food round 2
        scheduled: { food: { 3: 1, 4: 1, 5: 1 } },
        roomType: 'clay',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})
