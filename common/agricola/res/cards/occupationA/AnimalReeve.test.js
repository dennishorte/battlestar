const t = require('../../../testutil_v2.js')

describe('Animal Reeve', () => {
  test('onPlay gives 4 wood when 9+ rounds left', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['animal-reeve-a135'],
        occupations: [],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Animal Reeve')

    t.testBoard(game, {
      dennis: {
        occupations: ['animal-reeve-a135'],
        wood: 4,
      },
    })
  })

  test('getEndGamePointsAllPlayers: 1 VP for 2+ of each animal type', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
            { spaces: [{ row: 2, col: 1 }], boar: 2 },
            { spaces: [{ row: 2, col: 2 }], cattle: 2 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        score: 1,
        animals: { sheep: 2, boar: 2, cattle: 2 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
            { spaces: [{ row: 2, col: 1 }], boar: 2 },
            { spaces: [{ row: 2, col: 2 }], cattle: 2 },
          ],
        },
      },
    })
  })

  test('getEndGamePointsAllPlayers: 3 VP for 3+ of each animal type', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 3 },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }], boar: 3 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 3 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        score: 7,
        animals: { sheep: 3, boar: 3, cattle: 3 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 3 },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }], boar: 3 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 3 },
          ],
        },
      },
    })
  })

  test('getEndGamePointsAllPlayers: 5 VP for 4+ of each animal type', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 4 },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }], boar: 4 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 4 },
          ],
        },
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['animal-reeve-a135'] },
      micah: {
        score: 11,
        animals: { sheep: 4, boar: 4, cattle: 4 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }, { row: 2, col: 1 }], sheep: 4 },
            { spaces: [{ row: 0, col: 3 }, { row: 1, col: 3 }], boar: 4 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 4 },
          ],
        },
      },
    })
  })
})
