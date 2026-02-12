const t = require('../../../testutil_v2.js')

describe('Crudité', () => {
  test('buy 1 vegetable for 3 food when played', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['crudite-c057'],
        food: 3,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Crudité')
    t.choose(game, 'Buy 1 vegetable for 3 food')

    t.testBoard(game, {
      dennis: {
        food: 1,        // 3 + 1 (Meeting Place) - 3 (Crudité) = 1
        vegetables: 1,  // from Crudité
        minorImprovements: ['crudite-c057'],
      },
    })
  })
})
