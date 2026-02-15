const t = require('../../../testutil_v2.js')

describe('Reed Roof Renovator', () => {
  // Card text: "Each time another player renovates, you get 1 reed.
  // When you play this card in a 3-player game, you get 1 reed."

  test('gives reed on play in 3-player game', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['reed-roof-renovator-c144'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Reed Roof Renovator')

    t.testBoard(game, {
      dennis: {
        food: 10,
        reed: 1,
        occupations: ['reed-roof-renovator-c144'],
      },
    })
  })
})
