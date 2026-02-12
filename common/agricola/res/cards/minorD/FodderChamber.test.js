const t = require('../../../testutil_v2.js')

describe('Fodder Chamber', () => {
  test('scores 1 VP per 5 animals in 2-player game', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['fodder-chamber-d035'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 4 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], boar: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 4 },
          ],
        },
      },
    })
    game.run()

    // 2-player: threshold=5, animals=11, floor(11/5)=2 endgame + vps:2
    t.testBoard(game, {
      dennis: {
        score: 10,
        animals: { sheep: 4, boar: 3, cattle: 4 },
        minorImprovements: ['fodder-chamber-d035'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 4 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], boar: 3 },
            { spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], cattle: 4 },
          ],
        },
      },
    })
  })
})
