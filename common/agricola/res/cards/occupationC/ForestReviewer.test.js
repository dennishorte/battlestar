const t = require('../../../testutil_v2.js')

describe('Forest Reviewer', () => {
  // Card text: "Each time after any player (including you) uses the unoccupied
  // 'Grove' or 'Forest' accumulation space while the other of the two is
  // occupied, you get 1 reed."

  test('gives reed when Grove used while Forest occupied', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-reviewer-c145'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Forest')  // dennis takes Forest (gets 3 wood)
    t.choose(game, 'Grove')   // micah takes Grove while Forest is occupied -> dennis gets 1 reed

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 3,
        reed: 1,
        occupations: ['forest-reviewer-c145'],
      },
    })
  })
})
