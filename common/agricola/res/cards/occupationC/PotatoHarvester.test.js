const t = require('../../../testutil_v2.js')

describe('Potato Harvester', () => {
  // Card text: "When you play this card, you get 3 food. For each vegetable
  // from fields during harvest, you get 1 additional food."

  test('gives 3 food on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['potato-harvester-c106'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Potato Harvester')

    t.testBoard(game, {
      dennis: {
        food: 13,
        occupations: ['potato-harvester-c106'],
      },
    })
  })
})
