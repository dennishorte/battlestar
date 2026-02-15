const t = require('../../../testutil_v2.js')

describe('Skillful Renovator', () => {
  // Card text: "When you play this card, you get 1 wood and 1 clay.
  // Each time after you renovate, you get wood equal to people placed that round."

  test('gives wood and clay on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['skillful-renovator-c119'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Skillful Renovator')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        clay: 1,
        occupations: ['skillful-renovator-c119'],
      },
    })
  })
})
