const t = require('../../../testutil_v2.js')

describe('Stone Buyer', () => {
  // Card text: "When you play this card, you can buy 2 stone for 1 food.
  // From the next round on, 1 per round, you can buy 1 stone for 2 food."

  test('offers to buy 2 stone for 1 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stone-buyer-c143'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stone Buyer')
    t.choose(game, 'Buy 2 stone for 1 food')

    t.testBoard(game, {
      dennis: {
        food: 9,
        stone: 2,
        occupations: ['stone-buyer-c143'],
      },
    })
  })
})
