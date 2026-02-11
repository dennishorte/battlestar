const t = require('../../../testutil_v2.js')

describe('Work Certificate', () => {
  test('takes 1 wood from Forest after using Day Laborer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['work-certificate-a082'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    // Round 1: Forest accumulates to 3 (need 4+ for Work Certificate)
    // Dennis takes Forest (3 wood) — no Work Certificate offer (3 < 4)
    // Set up for round 2: take Forest without claiming, let it accumulate to 6
    // Instead, play round 1 fully, then round 2 Forest will have 6 wood.

    // Round 1: Both players take non-Forest actions
    t.choose(game, 'Grain Seeds')     // dennis
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Round 2: Forest now has 6 wood (3 + 3)
    // Dennis takes Day Laborer → onAction fires → choose to take 1 wood from Forest
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Take 1 wood (6 available)')

    t.testBoard(game, {
      dennis: {
        food: 3, // 2 from Day Laborer + 1 from Fishing
        grain: 1, // from Grain Seeds
        wood: 1, // 1 from Work Certificate
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['work-certificate-a082'],
      },
    })
  })

  test('can skip the work certificate offer', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['work-certificate-a082'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    // Round 1: skip Forest to let it accumulate
    t.choose(game, 'Grain Seeds')     // dennis
    t.choose(game, 'Day Laborer')     // micah
    t.choose(game, 'Fishing')         // dennis
    t.choose(game, 'Clay Pit')        // micah

    // Round 2: Dennis takes Day Laborer → skip Work Certificate
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3,
        grain: 1,
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['work-certificate-a082'],
      },
    })
  })
})
