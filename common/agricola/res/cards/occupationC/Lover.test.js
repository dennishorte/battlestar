const t = require('../../../testutil_v2.js')

describe('Lover', () => {
  // Card text: "When you play this card, immediately pay an amount of food equal
  // to the number of complete rounds left to play to take a 'Family Growth Even
  // without Room' action."

  test('pays food and gains family member', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market', 'Eastern Quarry',
      ],
      firstPlayer: 'dennis',
      dennis: {
        hand: ['lover-c127'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 12: rounds left = 14 - 12 = 2
    t.choose(game, 'Lessons A')
    t.choose(game, 'Lover')

    t.testBoard(game, {
      dennis: {
        food: 8,  // 10 - 2 rounds left
        familyMembers: 3,
        occupations: ['lover-c127'],
      },
    })
  })
})
