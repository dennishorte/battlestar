const t = require('../../../testutil_v2.js')

describe('Cube Cutter', () => {
  // Card text: "When you play this card, you get 1 wood. In the field phase
  // of each harvest, you can exchange 1 wood and 1 food for 1 BP."

  test('gives wood on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['cube-cutter-c098'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Cube Cutter')

    t.testBoard(game, {
      dennis: {
        food: 10,
        wood: 1,
        occupations: ['cube-cutter-c098'],
      },
    })
  })
})
