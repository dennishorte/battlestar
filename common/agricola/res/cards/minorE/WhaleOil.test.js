const t = require('../../../testutil_v2.js')

describe('Whale Oil', () => {
  test('stores food on Fishing, gives it before occupation play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        minorImprovements: ['whale-oil-e051'],
        hand: ['test-occupation-1'],
        food: 0,
      },
    })
    game.run()

    // Round 1: dennis takes Fishing → WhaleOil stores 1 food on card
    t.choose(game, 'Fishing')
    t.choose(game, 'Forest')         // micah
    // dennis takes Lessons → plays occupation
    // WhaleOil fires before occupation: gives 1 stored food
    // First occupation is free, so food is kept
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 1')
    t.choose(game, 'Clay Pit')       // micah

    t.testBoard(game, {
      dennis: {
        food: 2,   // 1 (Fishing round 1) + 1 (WhaleOil stored food before occ)
        occupations: ['test-occupation-1'],
        minorImprovements: ['whale-oil-e051'],
      },
    })
  })
})
