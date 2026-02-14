const t = require('../../../testutil_v2.js')

describe('RecycledBrick', () => {
  test('gives clay when renovating to stone', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['recycled-brick-d077'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        roomType: 'clay',
        stone: 2, // clay→stone: 1 stone/room × 2 rooms
        reed: 1, // clay→stone: 1 reed total
      },
      micah: { food: 10 },
      actionSpaces: ['House Redevelopment'],
    })
    game.run()

    // Dennis renovates clay→stone → RecycledBrick gives 2 clay (2 rooms)
    t.choose(game, 'House Redevelopment')
    // Improvement step skipped (no resources left)

    t.testBoard(game, {
      dennis: {
        clay: 2, // from RecycledBrick (2 rooms)
        roomType: 'stone',
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['recycled-brick-d077'],
      },
    })
  })
})
