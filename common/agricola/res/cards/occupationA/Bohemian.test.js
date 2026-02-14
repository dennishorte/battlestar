const t = require('../../../testutil_v2.js')

describe('Bohemian', () => {
  test('onReturnHomeStart gives 1 food when no Lessons spaces are occupied', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 0,
      },
    })
    game.run()

    // Round 2 work phase - 8 turns (4 players × 2 workers), no one uses Lessons
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Clay Pit')        // micah turn 1
    t.choose(game, 'Reed Bank')       // scott turn 1
    t.choose(game, 'Fishing')         // eliya turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Hollow')          // scott turn 2
    t.choose(game, 'Copse')           // eliya turn 2

    // Return home phase fires → Bohemian triggers (all Lessons unoccupied)
    // Game advances to round 3

    t.testBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 1, // 0 + 1 from Bohemian
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })

  test('onReturnHomeStart does not trigger when all Lessons spaces are occupied', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 0,
        hand: [],
      },
      micah: { hand: [] },
      scott: { hand: [] },
      eliya: { hand: [] },
    })
    game.run()

    // Round 2 work phase - 8 turns; micah & scott take both Lessons spaces
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Lessons A')       // micah turn 1 (auto-skips, empty hand)
    t.choose(game, 'Lessons B')       // scott turn 1 (auto-skips, empty hand)
    t.choose(game, 'Fishing')         // eliya turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Reed Bank')       // scott turn 2
    t.choose(game, 'Copse')           // eliya turn 2

    // Return home → Bohemian checks: both Lessons occupied → no food

    t.testBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 0, // No Bohemian bonus
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })

  test('onReturnHomeStart triggers when only one Lessons space is occupied', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 4 })
    t.setBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 0,
        hand: [],
      },
      micah: { hand: [] },
    })
    game.run()

    // Round 2 work phase - 8 turns; only micah uses Lessons A
    t.choose(game, 'Forest')          // dennis turn 1
    t.choose(game, 'Lessons A')       // micah turn 1 (auto-skips, empty hand)
    t.choose(game, 'Reed Bank')       // scott turn 1
    t.choose(game, 'Fishing')         // eliya turn 1
    t.choose(game, 'Grain Seeds')     // dennis turn 2
    t.choose(game, 'Day Laborer')     // micah turn 2
    t.choose(game, 'Hollow')          // scott turn 2
    t.choose(game, 'Copse')           // eliya turn 2

    // Return home → Bohemian: Lessons A occupied but Lessons B unoccupied → triggers

    t.testBoard(game, {
      dennis: {
        occupations: ['bohemian-a157'],
        food: 1, // 0 + 1 from Bohemian
        wood: 3, // From Forest
        grain: 1, // From Grain Seeds
      },
    })
  })
})
