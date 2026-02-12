const t = require('../../../testutil_v2.js')

describe('Iron Hoe', () => {
  test('plow 1 field when occupying both Grain Seeds and Vegetable Seeds', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['take-vegetable'],
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['iron-hoe-e020'],
      },
    })
    game.run()

    // Dennis takes Grain Seeds and Vegetable Seeds
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Vegetable Seeds')
    t.choose(game, 'Clay Pit')     // micah

    // Work phase ends → Iron Hoe triggers
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,0')  // plow location

    t.testBoard(game, {
      dennis: {
        grain: 1,       // Grain Seeds
        vegetables: 1,  // Vegetable Seeds
        minorImprovements: ['iron-hoe-e020'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })
})
