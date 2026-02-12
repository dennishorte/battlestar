const t = require('../../../testutil_v2.js')

describe('Misanthropy', () => {
  test('scores 5 VP for exactly 2 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['misanthropy-e035'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -9,
        minorImprovements: ['misanthropy-e035'],
      },
    })
  })

  test('scores 3 VP for exactly 3 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['misanthropy-e035'],
        familyMembers: 3,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -7,
        familyMembers: 3,
        minorImprovements: ['misanthropy-e035'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('scores 0 VP for 5 people', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        minorImprovements: ['misanthropy-e035'],
        familyMembers: 5,
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -2,
        familyMembers: 5,
        minorImprovements: ['misanthropy-e035'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 },
            { row: 0, col: 1 }, { row: 1, col: 1 },
          ],
        },
      },
    })
  })
})
