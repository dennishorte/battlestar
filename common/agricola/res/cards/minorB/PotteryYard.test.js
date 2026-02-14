const t = require('../../../testutil_v2.js')

describe('Pottery Yard', () => {
  test('scores 2 bonus points when 2 adjacent unused spaces exist', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['pottery-yard-b031'],
      },
    })
    game.run()

    // Default farmyard has lots of unused spaces (13), so adjacent pair exists
    // Score: -14 base + 1 VP card + 2 bonus = -11
    t.testBoard(game, {
      dennis: {
        score: -11,
        minorImprovements: ['pottery-yard-b031'],
      },
    })
  })

  test('no bonus when no adjacent unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['pottery-yard-b031'],
        farmyard: {
          fields: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
    game.run()

    // All non-room spaces are fields or pasture, no adjacent unused pair
    // Score: fields(5+)=+4, 1 pasture=+1, unused(0)=0, rooms=0, family=+6, 1VP card, 5 categories:-5 = +7
    t.testBoard(game, {
      dennis: {
        score: 7,
        minorImprovements: ['pottery-yard-b031'],
        farmyard: {
          fields: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
            { row: 2, col: 3 },
            { row: 2, col: 4 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })

  test('still gets bonus despite negative points for unused spaces', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['pottery-yard-b031'],
        farmyard: {
          fields: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
    game.run()

    // 2 unused spaces (2,3) and (2,4) are adjacent → bonus applies
    // Score: fields(5+)=+4, 1 pasture=+1, unused(2)=-2, rooms=0, family=+6, 1VP card, +2 bonus, 5 categories:-5 = +7
    t.testBoard(game, {
      dennis: {
        score: 7,
        minorImprovements: ['pottery-yard-b031'],
        farmyard: {
          fields: [
            { row: 0, col: 1 },
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
          ],
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })
})
