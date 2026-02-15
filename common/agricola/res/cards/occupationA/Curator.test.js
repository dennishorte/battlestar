const t = require('../../../testutil_v2.js')

describe('Curator', () => {
  test('onReturnHome offers buy 1 bonus point for 1 food when 3+ from accumulation', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6, // 3 workers each so dennis gets 3 actions
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['curator-a100'],
        food: 5,
        familyMembers: 3,
      },
      micah: { familyMembers: 3 },
    })
    game.run()

    // Round 6: 6 actions (dennis 1st, 3rd, 5th). Dennis takes 3 accumulation.
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Fishing')      // dennis
    t.choose(game, 'Grain Seeds')  // micah

    // Return home: Curator triggers (3 from accumulation), offer
    t.choose(game, 'Buy 1 bonus point for 1 food')

    t.testBoard(game, {
      dennis: {
        occupations: ['curator-a100'],
        familyMembers: 3,
        food: 5, // 5 - 1 (bonus point); +1 from fishing
        wood: 3,
        reed: 1,
        bonusPoints: 1,
      },
    })
  })

  test('onReturnHome allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['curator-a100'],
        food: 5,
        familyMembers: 3,
      },
      micah: { familyMembers: 3 },
    })
    game.run()

    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Fishing')      // dennis
    t.choose(game, 'Grain Seeds')  // micah

    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['curator-a100'],
        familyMembers: 3,
        food: 6, // 5 + 1 (Fishing); no spend
        wood: 3,
        reed: 1,
        bonusPoints: 0,
      },
    })
  })

  test('onReturnHome does not trigger when fewer than 3 from accumulation', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['curator-a100'],
        food: 3,
      },
    })
    game.run()

    // Round 2: 4 actions. Dennis takes 2 accumulation (Forest, Reed Bank) — not 3.
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Day Laborer')  // micah

    // Return home: Curator does not trigger (only 2 from accumulation)

    t.testBoard(game, {
      dennis: {
        occupations: ['curator-a100'],
        food: 3,
        wood: 3,
        reed: 1,
        bonusPoints: 0,
      },
    })
  })

  test('onReturnHome does not offer when player has no food', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 6,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['curator-a100'],
        food: 0,
        familyMembers: 3,
      },
      micah: { familyMembers: 3 },
    })
    game.run()

    // Dennis takes 3 accumulation with no food: Forest, Reed Bank, Clay Pit
    t.choose(game, 'Forest')       // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Reed Bank')    // dennis
    t.choose(game, 'Grain Seeds')  // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Fishing')      // micah

    // Curator: 3+ from accumulation but food 0 → no offer
    t.testBoard(game, {
      dennis: {
        occupations: ['curator-a100'],
        familyMembers: 3,
        wood: 3,
        reed: 1,
        clay: 1,
        bonusPoints: 0,
      },
    })
  })
})
