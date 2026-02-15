const t = require('../../../testutil_v2.js')

describe('Freemason', () => {
  // Card text: "As long as you live in a clay/stone house with exactly 2 rooms,
  // at the start of each work phase, you get 2 clay/stone."

  test('gives 2 clay at work phase start with 2 clay rooms', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['freemason-c123'],
        food: 10,
        roomType: 'clay',
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 12,
        clay: 2,
        roomType: 'clay',
        occupations: ['freemason-c123'],
      },
    })
  })
})
