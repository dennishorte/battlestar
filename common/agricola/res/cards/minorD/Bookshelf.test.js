const t = require('../../../testutil_v2.js')

describe('Bookshelf', () => {
  test('gives 3 food before playing an occupation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['bookshelf-d049'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        hand: ['test-occupation-4'],
        food: 1, // 1 food + 3 from Bookshelf = 4, enough to pay 2nd occ cost (1 food)
      },
    })
    game.run()

    // Lessons A: play occupation (4th occupation, costs 1 food)
    // Bookshelf fires before cost → gives 3 food (1 + 3 = 4)
    // Then pays 1 food for occupation → 3 food remaining
    t.choose(game, 'Lessons A')
    t.choose(game, 'Test Occupation 4')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 3, // 1 + 3 (Bookshelf) - 1 (occupation cost) = 3
        minorImprovements: ['bookshelf-d049'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3', 'test-occupation-4'],
      },
    })
  })
})
