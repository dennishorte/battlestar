const t = require('../../../testutil_v2.js')

describe('Constable', () => {
  // Card text: "Based on rounds left, you get wood. During scoring, each
  // player with no negative points gets 3 BP."

  test('gives wood on play based on rounds left', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['constable-c135'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 9 (9 action spaces), 14-9=5 rounds left >= 3 -> 2 wood
    t.choose(game, 'Lessons A')
    t.choose(game, 'Constable')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 2,
        occupations: ['constable-c135'],
      },
    })
  })
})
