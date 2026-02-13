const t = require('../../../testutil_v2.js')

describe('Roman Pot', () => {
  test('gives 1 food at each work phase start when last in turn order', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      micah: {
        minorImprovements: ['roman-pot-e056'],
      },
    })

    // Initialize card state after reset (onPlay is skipped by minorImprovements in setBoard)
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.cardState('roman-pot-e056').stored = 1000
    })
    game.run()

    // Round 1 start: onWorkPhaseStart → micah is last → +1 food
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    // Round 2 start: onWorkPhaseStart → micah is last → +1 food
    // testBoard reads state here (game waiting for round 2 actions)
    t.testBoard(game, {
      micah: {
        food: 2,   // +1 (round 1 work phase) + +1 (round 2 work phase)
        wood: 3,   // from Forest
        clay: 1,   // from Clay Pit
        minorImprovements: ['roman-pot-e056'],
      },
    })
  })

  test('does not fire for first player', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        minorImprovements: ['roman-pot-e056'],
      },
    })

    // Initialize card state after reset (onPlay skipped by minorImprovements)
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.cardState('roman-pot-e056').stored = 1000
    })
    game.run()

    // Round 1 start: onWorkPhaseStart → dennis is first (NOT last) → no food
    t.choose(game, 'Day Laborer')   // dennis
    t.choose(game, 'Forest')        // micah
    t.choose(game, 'Fishing')       // dennis
    t.choose(game, 'Clay Pit')      // micah

    t.testBoard(game, {
      dennis: {
        food: 3,    // 0 + 2 (Day Laborer) + 1 (Fishing) — no Roman Pot food
        minorImprovements: ['roman-pot-e056'],
      },
    })
  })
})
