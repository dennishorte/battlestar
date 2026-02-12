const t = require('../../../testutil_v2.js')

describe('Ox Goad', () => {
  test('pay 2 food to plow a field after Cattle Market', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['take-cattle'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['ox-goad-e019'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        food: 2,
      },
    })
    game.run()

    // Dennis uses Cattle Market (1 cattle accumulated) → Ox Goad triggers
    t.choose(game, 'Cattle Market')
    t.choose(game, 'Pay 2 food to plow 1 field')
    t.choose(game, '2,0')  // choose plow location

    t.testBoard(game, {
      dennis: {
        food: 0,  // 2 - 2 (Ox Goad) = 0
        pet: 'cattle',
        animals: { cattle: 1 },
        minorImprovements: ['ox-goad-e019'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
