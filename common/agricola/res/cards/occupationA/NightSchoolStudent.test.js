const t = require('../../../testutil_v2.js')

describe('Night School Student', () => {
  test('onReturnHome offers occupation for 1 food when no player returned from Lessons', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152'],
        hand: ['test-occupation-1'],
        food: 2,
      },
    })
    game.run()

    // Round 2 work phase - 6 turns (3 players × 2 workers), no one uses Lessons
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Clay Pit')        // micah turn 1
    t.choose(game, 'Reed Bank')       // scott turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Fishing')         // scott turn 2

    // Return home → Night School Student triggers (no Lessons used)
    // offerPlayOccupation delegates to playOccupation with costOverride: 1
    t.choose(game, 'Test Occupation 1')  // Card name, not ID

    t.testBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152', 'test-occupation-1'],
        hand: [],
        food: 1, // 2 - 1 paid for occupation
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })

  test('onReturnHome does not trigger when a player returned from Lessons', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152'],
        hand: ['test-occupation-1'],
        food: 2,
      },
      micah: { hand: ['test-occupation-2'] },
    })
    game.run()

    // Round 2 work phase - micah uses Lessons A
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Lessons A')       // micah turn 1
    t.choose(game, 'Test Occupation 2')
    t.choose(game, 'Reed Bank')       // scott turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Fishing')         // scott turn 2

    // Return home → Night School Student does NOT trigger (Lessons was used)
    // Game advances to round 3

    t.testBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152'],
        hand: ['test-occupation-1'], // Not played
        food: 2, // Unchanged (no food from actions, no occupation cost)
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })

  test('onReturnHome allows skipping occupation play', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152'],
        hand: ['test-occupation-1'],
        food: 2,
      },
    })
    game.run()

    // Round 2 work phase - 6 turns, no one uses Lessons
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Clay Pit')        // micah turn 1
    t.choose(game, 'Reed Bank')       // scott turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Fishing')         // scott turn 2

    // Return home → Night School Student triggers, skip
    t.choose(game, 'Do not play an occupation')

    t.testBoard(game, {
      dennis: {
        occupations: ['night-school-student-a152'],
        hand: ['test-occupation-1'], // Not played
        food: 2, // Unchanged
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })
})
