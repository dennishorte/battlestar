const t = require('../../../testutil_v2.js')

describe('Seed Researcher', () => {
  // Card text: "Each time any people return from both 'Grain Seeds' and
  // 'Vegetable Seeds' action spaces, you get 2 food and can play 1 occupation."

  test('gives 2 food when both Grain Seeds and Vegetable Seeds are occupied', () => {
    // actionSpaces with 8 round cards → round 9 (a harvest round)
    // food: 0 + 2(DL) + 2(SR) = 4 → harvest feeds 2 family = 4 → 0 food, no begging
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['seed-researcher-c097'],
        hand: ['test-occupation-1'],
        food: 0,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Grain Seeds')     // dennis
    t.choose(game, 'Vegetable Seeds') // micah
    t.choose(game, 'Day Laborer')     // dennis: +2 food
    t.choose(game, 'Forest')          // micah

    // Return home: SR triggers → +2 food, free occupation
    t.choose(game, 'Test Occupation 1')

    // Harvest: 0 + 2(DL) + 2(SR) = 4, feed 4 → 0 food, 0 begging
    t.testBoard(game, {
      dennis: {
        occupations: ['seed-researcher-c097', 'test-occupation-1'],
        food: 0,
        grain: 1,
        beggingCards: 0,
      },
    })
  })
})
