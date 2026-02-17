const t = require('../../../testutil_v2.js')

describe('Housebook Master', () => {
  // Card text: "After playing this card, if you renovate to stone in round
  // 13/12/11 or before, you immediately get 1/2/3 food and 1/2/3 bonus points."
  // Uses onRenovate hook. Card is 1+ players.

  test('renovate to stone in round 9 gives 3 food and 3 BP', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'House Redevelopment', 'Basic Wish for Children', 'Western Quarry',
        'Vegetable Seeds', 'Pig Market',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'clay',
        stone: 5,
        reed: 5,
      },
    })
    game.run()

    // Round 9: clay → stone renovation (2 stone + 1 reed for 2 rooms)
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'stone',
        stone: 3,  // 5 - 2 (renovation)
        reed: 4,   // 5 - 1 (renovation)
        food: 3,   // 0 + 3 (Housebook Master: round 9 ≤ 11)
        bonusPoints: 3,
      },
    })
  })

  test('renovate to stone in round 12 gives 2 food and 2 BP', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'House Redevelopment', 'Basic Wish for Children', 'Western Quarry',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market', 'Eastern Quarry', 'Urgent Wish for Children',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'clay',
        stone: 5,
        reed: 5,
      },
    })
    game.run()

    // Round 12: clay → stone renovation
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'stone',
        stone: 3,
        reed: 4,
        food: 2,   // 0 + 2 (Housebook Master: round 12)
        bonusPoints: 2,
      },
    })
  })

  test('renovate to clay gives no bonus', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'wood',
        clay: 5,
        reed: 5,
      },
    })
    game.run()

    // Round 5: wood → clay renovation (2 clay + 1 reed for 2 rooms)
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['housebook-master-b134'],
        roomType: 'clay',
        clay: 3,   // 5 - 2 (renovation)
        reed: 4,   // 5 - 1 (renovation)
        food: 0,   // no bonus (not stone)
        bonusPoints: 0,
      },
    })
  })
})
