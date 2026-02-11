const t = require('../../../testutil_v2.js')

describe('Grange', () => {
  test('gives 1 food when played with 6 fields and all animal types', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['grange-b037'],
        farmyard: {
          fields: [
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 1, col: 4 },
          ],
          pastures: [
            { spaces: [{ row: 0, col: 3 }] },
            { spaces: [{ row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }] },
          ],
        },
        animals: { sheep: 1, boar: 1, cattle: 1 },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Grange')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Meeting Place + 1 from Grange
        animals: { sheep: 1, boar: 1, cattle: 1 },
        minorImprovements: ['grange-b037'],
        farmyard: {
          fields: [
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
            { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 1, col: 4 },
          ],
          pastures: [
            { spaces: [{ row: 0, col: 3 }], sheep: 1 },
            { spaces: [{ row: 0, col: 4 }], boar: 1 },
            { spaces: [{ row: 1, col: 3 }], cattle: 1 },
          ],
        },
      },
    })
  })
})
