const t = require('../../../testutil_v2.js')

describe('Mineral Feeder', () => {
  test('gives 1 grain at round start if player has sheep (non-harvest round)', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mineral-feeder-c067'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 2 },
          ],
        },
      },
    })
    game.run()

    // onRoundStart fires at start of round 5 (non-harvest) → +1 grain
    t.testBoard(game, {
      dennis: {
        grain: 1,
        animals: { sheep: 2 },
        minorImprovements: ['mineral-feeder-c067'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 2 },
          ],
        },
      },
    })
  })

  test('does not give grain on harvest round', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // harvest round
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['mineral-feeder-c067'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 2 },
          ],
        },
      },
    })
    game.run()

    // Round 4 is harvest → no grain
    t.testBoard(game, {
      dennis: {
        grain: 0,
        animals: { sheep: 2 },
        minorImprovements: ['mineral-feeder-c067'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 2 },
          ],
        },
      },
    })
  })
})
