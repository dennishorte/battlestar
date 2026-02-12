const t = require('../../../testutil_v2.js')

describe('Dwelling Plan', () => {
  test('offers renovation on play', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['dwelling-plan-d002'],
        food: 1,
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Dwelling Plan')

    // Wood→Clay renovation costs 1 clay + 1 reed per room (2 rooms = 2 clay + 2 reed)
    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        roomType: 'clay',
        clay: 3, // 5 - 2 (renovation cost: 1 clay/room)
        reed: 1, // 2 - 1 (renovation cost: 1 reed flat)
        food: 1, // 1 start + 1 Meeting Place - 1 card cost
        minorImprovements: ['dwelling-plan-d002'],
      },
    })
  })
})
