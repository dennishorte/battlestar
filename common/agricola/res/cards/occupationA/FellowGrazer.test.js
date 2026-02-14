const t = require('../../../testutil_v2.js')

describe('Fellow Grazer', () => {
  test('getEndGamePoints: 0 VP with no pastures', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['fellow-grazer-a099'],
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['fellow-grazer-a099'],
        score: -14,
      },
    })
  })

  test('getEndGamePoints: 0 VP for pastures with fewer than 3 spaces', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['fellow-grazer-a099'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['fellow-grazer-a099'],
        score: -10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }] },
          ],
        },
      },
    })
  })

  test('getEndGamePoints: +2 VP per pasture with 3+ spaces', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['fellow-grazer-a099'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['fellow-grazer-a099'],
        score: -7,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
          ],
        },
      },
    })
  })

  test('getEndGamePoints: +4 VP for two pastures with 3+ spaces', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['fellow-grazer-a099'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        occupations: ['fellow-grazer-a099'],
        score: -1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }, { row: 2, col: 3 }] },
          ],
        },
      },
    })
  })
})
