const t = require('../../../testutil_v2.js')

describe('Livestock Expert', () => {
  test('doubles sheep when played in round <= 11', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['livestock-expert-e138'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
        animals: { sheep: 2 },
      },
    })
    game.run()

    // Play Livestock Expert via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Livestock Expert')
    // onPlay fires: choose animal type
    t.choose(game, 'Double sheep (2 \u2192 4)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { sheep: 4 },
        occupations: ['livestock-expert-e138'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 4 }],
        },
      },
    })
  })

  test('doubles boar when chosen', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['livestock-expert-e138'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] },
          ],
        },
        animals: { sheep: 2, boar: 1 },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Livestock Expert')
    t.choose(game, 'Double boar (1 \u2192 2)')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { sheep: 2, boar: 2 },
        occupations: ['livestock-expert-e138'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], boar: 2 },
          ],
        },
      },
    })
  })

  test('does not trigger after round 11', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['livestock-expert-e138'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] }],
        },
        animals: { sheep: 2 },
      },
      micah: { food: 10 },
    })
    game.run()

    // Play in round 12 — no onPlay effect (round > 11)
    t.choose(game, 'Lessons A')
    t.choose(game, 'Livestock Expert')
    // No doubling prompt

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        animals: { sheep: 2 }, // unchanged
        food: 10,
        occupations: ['livestock-expert-e138'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 }],
        },
      },
    })
  })
})
