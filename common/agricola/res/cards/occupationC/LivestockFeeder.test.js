const t = require('../../../testutil_v2.js')

describe('Livestock Feeder', () => {
  // Card text: "When you play this card, you get 1 grain. Each grain in your
  // supply can hold 1 animal of any type."

  test('gives grain on play', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['livestock-feeder-c086'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Livestock Feeder')

    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        occupations: ['livestock-feeder-c086'],
      },
    })
  })
})
