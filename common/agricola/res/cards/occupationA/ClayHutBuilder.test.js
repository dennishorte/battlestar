const t = require('../../../testutil_v2.js')

describe('Clay Hut Builder', () => {
  test('schedules 2 clay on next 5 rounds when renovating from wood', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'wood',
        clay: 2, // 1 clay per room × 2 rooms
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'clay',
        scheduled: { clay: { 6: 2, 7: 2, 8: 2, 9: 2, 10: 2 } },
      },
    })
  })

  test('does not trigger when renovating from clay to stone', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'clay',
        stone: 2, // 1 stone per room × 2 rooms
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'stone',
        scheduled: {},
      },
    })
  })

  test('does not schedule clay beyond round 14', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    // Round 11: next 5 would be 12, 13, 14, 15, 16 — only 12, 13, 14 are valid
    t.testBoard(game, {
      dennis: {
        occupations: ['clay-hut-builder-a120'],
        roomType: 'clay',
        scheduled: { clay: { 12: 2, 13: 2, 14: 2 } },
      },
    })
  })
})
