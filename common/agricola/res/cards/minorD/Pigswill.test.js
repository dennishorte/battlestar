const t = require('../../../testutil_v2.js')

describe('Pigswill', () => {
  test('gives 1 wild boar when using Fencing action', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Fencing'],
      dennis: {
        minorImprovements: ['pigswill-d083'],
        wood: 10,
      },
    })
    game.run()

    // Dennis takes Fencing → builds 1-space pasture → Pigswill gives 1 boar
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 2 }] })
    t.choose(game, 'Done building fences')

    t.testBoard(game, {
      dennis: {
        wood: 6, // 10 - 4 fences
        animals: { boar: 1 },
        minorImprovements: ['pigswill-d083'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 2 }], boar: 1 }],
        },
      },
    })
  })
})
