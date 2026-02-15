const t = require('../../../testutil_v2.js')

describe('Seatmate', () => {
  // Card text: "You can use the action space on round space 13 even if it is
  // occupied by one or more people of the players to your immediate left and right."
  // Uses canUseOccupiedActionSpace hook. Requires 3+ players to test neighbor logic.

  test('can use round 13 action space occupied by neighbor', () => {
    // 3 players: dennis(0), micah(1), scott(2).
    // dennis's right neighbor = micah(1), left neighbor = scott(2).
    // List all 13 stage 1-5 cards so the 13th (Urgent Wish) has getActionSpaceRound=13.
    // Game plays round 14.
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market', 'Eastern Quarry',
        'Cultivation', 'Urgent Wish for Children',
      ],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['seatmate-b129'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // micah takes Urgent Wish for Children (the round 13 space)
    t.choose(game, 'Urgent Wish for Children')

    // scott's turn (AI)
    t.choose(game, 'Day Laborer')

    // Now it's dennis's turn — Urgent Wish should be available
    // (occupied by micah, who is dennis's right neighbor)
    const choices = t.currentChoices(game)
    expect(choices).toContain('Urgent Wish for Children')
  })

  test('cannot use round 13 space occupied by non-neighbor', () => {
    // 4 players: dennis(0), micah(1), scott(2), eliya(3).
    // dennis's neighbors: micah(right=1), eliya(left=3).
    // scott(2) is NOT a neighbor of dennis.
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
        'Vegetable Seeds', 'Pig Market',
        'Cattle Market', 'Eastern Quarry',
        'Cultivation', 'Urgent Wish for Children',
      ],
      firstPlayer: 'scott',
      dennis: {
        occupations: ['seatmate-b129'],
        food: 20,
      },
      micah: { food: 20 },
      scott: { food: 20 },
    })
    game.run()

    // scott (non-neighbor of dennis) takes Urgent Wish for Children
    t.choose(game, 'Urgent Wish for Children')

    // eliya's turn
    t.choose(game, 'Day Laborer')

    // micah's turn
    t.choose(game, 'Forest')

    // Now it's dennis's turn — Urgent Wish should NOT be available
    // (occupied by scott who is not a neighbor)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Urgent Wish for Children')
  })
})
