const t = require('../../../testutil_v2.js')

describe('FarmBuilding', () => {
  test('schedules food on next 3 rounds when building major improvement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        minorImprovements: ['farm-building-c043'],
        clay: 2, // for Fireplace (2 clay)
      },
    })
    game.run()

    // Dennis buys Fireplace (2 clay) → Farm Building triggers: schedule 1 food on rounds 3, 4, 5
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Fireplace (fireplace-2)')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['farm-building-c043'],
        majorImprovements: ['fireplace-2'],
        scheduled: { food: { 3: 1, 4: 1, 5: 1 } },
      },
    })
  })
})
