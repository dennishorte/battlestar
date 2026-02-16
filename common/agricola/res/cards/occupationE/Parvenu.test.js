const t = require('../../../testutil_v2.js')

describe('Parvenu', () => {
  test('doubles clay when choosing clay in round 2', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['parvenu-e145'],
        clay: 3,
      },
    })
    game.run()

    // Play Parvenu via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Parvenu')
    // onPlay fires: choose clay or reed
    t.choose(game, 'Clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 6, // 3 + 3 doubled
        occupations: ['parvenu-e145'],
      },
    })
  })

  test('doubles reed when choosing reed in round 2', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['parvenu-e145'],
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Parvenu')
    t.choose(game, 'Reed')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        reed: 4, // 2 + 2 doubled
        occupations: ['parvenu-e145'],
      },
    })
  })

  test('does nothing if you have 0 of the chosen resource', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['parvenu-e145'],
        clay: 0,
        reed: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Parvenu')
    t.choose(game, 'Clay')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0, // 0 + 0 = 0
        occupations: ['parvenu-e145'],
      },
    })
  })

  test('does not trigger after round 7', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 8,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['parvenu-e145'],
        clay: 3,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // Play Parvenu in round 8 — no effect (round > 7)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Parvenu')
    // No choice prompt — onPlay sees round 8 > 7

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 3,  // unchanged
        food: 10, // unchanged
        occupations: ['parvenu-e145'],
      },
    })
  })
})
