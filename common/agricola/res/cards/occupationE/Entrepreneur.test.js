const t = require('../../../testutil_v2.js')

describe('Entrepreneur', () => {
  test('moves food to card and gets missing building resource', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['entrepreneur-e162'],
        food: 3,
        // has no wood, clay, reed, or stone — all missing
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('entrepreneur-e162').food = 0
    })
    game.run()

    // Round 2 starts — Entrepreneur fires
    // Player has food (3) so "Move 1 food to card" is available
    t.choose(game, 'Move 1 food to card')
    // Then choose missing building resource
    t.choose(game, '1 wood')

    t.testBoard(game, {
      dennis: {
        food: 2, // 3 - 1 moved to card
        wood: 1, // from Entrepreneur
        occupations: ['entrepreneur-e162'],
      },
    })
  })

  test('discards food from card and gets missing building resource', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['entrepreneur-e162'],
        food: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('entrepreneur-e162').food = 2
    })
    game.run()

    // Round 2 starts — player has no food but card has 2
    t.choose(game, 'Discard 1 food from card')
    t.choose(game, '1 clay')

    t.testBoard(game, {
      dennis: {
        clay: 1,
        food: 0,
        occupations: ['entrepreneur-e162'],
      },
    })
  })

  test('skips when choosing to not move or discard food', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['entrepreneur-e162'],
        food: 3,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('entrepreneur-e162').food = 1
    })
    game.run()

    // Both options available, but skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 3, // unchanged
        occupations: ['entrepreneur-e162'],
      },
    })
  })

  test('does not trigger when no food anywhere', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['entrepreneur-e162'],
        food: 0,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('entrepreneur-e162').food = 0
    })
    game.run()

    // No food on player, no food on card — Entrepreneur does nothing
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 2, // from Day Laborer
        occupations: ['entrepreneur-e162'],
      },
    })
  })

  test('only offers building resources the player does not have', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['entrepreneur-e162'],
        food: 3,
        wood: 1,
        clay: 1,
        reed: 1,
        // stone: 0 — only missing resource
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('entrepreneur-e162').food = 0
    })
    game.run()

    // Move food to card
    t.choose(game, 'Move 1 food to card')
    // Only stone is missing — auto-selected (no choice needed)

    t.testBoard(game, {
      dennis: {
        food: 2,
        wood: 1,
        clay: 1,
        reed: 1,
        stone: 1, // auto-given (only missing)
        occupations: ['entrepreneur-e162'],
      },
    })
  })
})
