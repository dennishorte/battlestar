const t = require('../../../testutil_v2.js')

describe('Sour Dough', () => {
  test('all players have workers left — can bake instead of placing', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sour-dough-e062'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    // Dennis turn 1: bake bread via Sour Dough (skip placement)
    t.choose(game, 'Bake Bread (Sour Dough)')
    t.choose(game, 'Bake 1 grain')

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 2 (still has 2 workers)
    t.choose(game, 'Forest')
    // Micah turn 2
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sour-dough-e062'],
        majorImprovements: ['fireplace-2'],
        grain: 2,
        food: 2, // 0 + 2 from baking 1 grain with fireplace
        wood: 3, // from Forest
      },
    })
  })

  test('once per round — not offered again same round', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sour-dough-e062'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    // Dennis turn 1: bake bread via Sour Dough
    t.choose(game, 'Bake Bread (Sour Dough)')
    t.choose(game, 'Bake 1 grain')

    // Micah turn 1
    t.choose(game, 'Day Laborer')

    // Dennis turn 2: Sour Dough should NOT be offered again
    expect(t.currentChoices(game)).not.toContain('Bake Bread (Sour Dough)')
  })

  test('not offered when opponent has 0 workers left', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sour-dough-e062'],
        majorImprovements: ['fireplace-2'],
        grain: 3,
      },
    })
    game.run()

    // Micah turn 1
    t.choose(game, 'Day Laborer')
    // Dennis turn 1
    t.choose(game, 'Forest')
    // Micah turn 2 (last worker)
    t.choose(game, 'Clay Pit')

    // Dennis turn 2: micah has 0 workers left → Sour Dough not available
    expect(t.currentChoices(game)).not.toContain('Bake Bread (Sour Dough)')
  })

  test('not offered without baking improvement', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['sour-dough-e062'],
        // No baking improvement
        grain: 3,
      },
    })
    game.run()

    expect(t.currentChoices(game)).not.toContain('Bake Bread (Sour Dough)')
  })
})
