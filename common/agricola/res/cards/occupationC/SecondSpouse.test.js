const t = require('../../../testutil_v2.js')

describe('Second Spouse', () => {
  // Card text: "You can use the 'Urgent Wish for Children' action space
  // even if it is occupied by the first person another player placed."

  test('allows using Urgent Wish occupied by first person of another player', () => {
    // 2 players. List all 13 stage 1-5 round cards so Urgent Wish is at round 13.
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 2 })
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
        occupations: ['second-spouse-c129'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // micah's first person takes Urgent Wish for Children
    t.choose(game, 'Urgent Wish for Children')

    // dennis's turn — Urgent Wish should be available (micah's first person)
    const choices = t.currentChoices(game)
    expect(choices).toContain('Urgent Wish for Children')
  })

  test('does not allow when occupied by second person', () => {
    // 3 players. micah uses first person on something else, then second on Urgent Wish.
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
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
        occupations: ['second-spouse-c129'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // micah's first person takes Day Laborer
    t.choose(game, 'Day Laborer')

    // scott's turn
    t.choose(game, 'Forest')

    // dennis's first turn
    t.choose(game, 'Clay Pit')

    // micah's second person takes Urgent Wish for Children
    t.choose(game, 'Urgent Wish for Children')

    // scott's turn
    t.choose(game, 'Grain Seeds')

    // dennis's turn — Urgent Wish should NOT be available (micah's second person)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Urgent Wish for Children')
  })

  test('does not allow using other occupied action spaces', () => {
    // Verify the card only works for family-growth-urgent, not arbitrary occupied spaces
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 2 })
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
        occupations: ['second-spouse-c129'],
        food: 20,
      },
      micah: { food: 20 },
    })
    game.run()

    // micah's first person takes Day Laborer
    t.choose(game, 'Day Laborer')

    // dennis's turn — Day Laborer should NOT be available (Second Spouse only works for Urgent Wish)
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Day Laborer')
  })
})
