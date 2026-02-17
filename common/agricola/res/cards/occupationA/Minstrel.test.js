const t = require('../../../testutil_v2.js')

describe('Minstrel', () => {
  // Card is 3+ players. onReturnHomeStart: if exactly 1 action space card on rounds 1-4
  // is unoccupied, you may use that action space.

  test('uses unoccupied round 1-4 space when exactly one is unoccupied', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [
        'Sheep Market', 'Grain Utilization', 'Fencing', 'Major Improvement',
        'Basic Wish for Children',
      ],
      dennis: {
        occupations: ['minstrel-a151'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    // Round 5: 6 actions (3 players x 2 workers)
    // Occupy 3 of 4 round 1-4 spaces: Grain Utilization, Fencing, Major Improvement
    // Leave Sheep Market unoccupied
    t.choose(game, 'Grain Utilization')  // dennis (no grain/baking, auto-skips)
    t.choose(game, 'Fencing')            // micah (no wood, auto-skips)
    t.choose(game, 'Major Improvement')  // scott (no resources, auto-skips)
    t.choose(game, 'Day Laborer')        // dennis
    t.choose(game, 'Forest')             // micah
    t.choose(game, 'Clay Pit')           // scott

    // Return home: Minstrel fires — exactly 1 unoccupied (Sheep Market)
    t.choose(game, 'Use Sheep Market')

    // Sheep Market had 1 accumulated sheep, auto-placed into pasture
    t.testBoard(game, {
      dennis: {
        occupations: ['minstrel-a151'],
        food: 2,   // from Day Laborer
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })

  test('can skip when exactly one round 1-4 space is unoccupied', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [
        'Sheep Market', 'Grain Utilization', 'Fencing', 'Major Improvement',
        'Basic Wish for Children',
      ],
      dennis: {
        occupations: ['minstrel-a151'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()

    // Occupy 3 of 4 round 1-4 spaces, leave Sheep Market unoccupied
    t.choose(game, 'Grain Utilization')  // dennis
    t.choose(game, 'Fencing')            // micah
    t.choose(game, 'Major Improvement')  // scott
    t.choose(game, 'Day Laborer')        // dennis
    t.choose(game, 'Forest')             // micah
    t.choose(game, 'Clay Pit')           // scott

    // Minstrel fires — skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['minstrel-a151'],
        food: 2,   // from Day Laborer only
        animals: { sheep: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('no prompt when 0 or 2+ round 1-4 spaces are unoccupied', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: [
        'Sheep Market', 'Grain Utilization', 'Fencing', 'Major Improvement',
        'Basic Wish for Children',
      ],
      dennis: {
        occupations: ['minstrel-a151'],
      },
    })
    game.run()

    // Only occupy 2 of 4 round 1-4 spaces → 2 unoccupied → no Minstrel prompt
    t.choose(game, 'Grain Utilization')  // dennis (auto-skips)
    t.choose(game, 'Fencing')            // micah (auto-skips)
    t.choose(game, 'Day Laborer')        // scott
    t.choose(game, 'Forest')             // dennis
    t.choose(game, 'Clay Pit')           // micah
    t.choose(game, 'Reed Bank')          // scott

    // No Minstrel prompt — 2 spaces unoccupied (Sheep Market and Major Improvement)
    // Game proceeds to next round without prompting

    t.testBoard(game, {
      dennis: {
        occupations: ['minstrel-a151'],
        wood: 3,  // from Forest
      },
    })
  })
})
