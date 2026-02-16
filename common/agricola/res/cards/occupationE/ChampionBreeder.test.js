const t = require('../../../testutil_v2.js')

describe('Champion Breeder', () => {
  test('gives 1 bonus point when 2 newborn types during breeding', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4, // first harvest round
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['champion-breeder-e133'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], boar: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: breeding phase -> 2 sheep breeds 1, 2 boar breeds 1 = 2 newborn types
    // ChampionBreeder: 2 newborns => 1 bonus point
    t.testBoard(game, {
      round: 5,
      dennis: {
        bonusPoints: 1,
        food: 8, // 10 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        animals: { sheep: 3, boar: 3 },
        occupations: ['champion-breeder-e133'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 3 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], boar: 3 },
          ],
        },
      },
    })
  })

  test('gives 2 bonus points when 3 newborn types during breeding', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['champion-breeder-e133'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 2 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], boar: 2 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 2 },
          ],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Clay Pit')     // dennis
    t.choose(game, 'Reed Bank')    // micah

    // Harvest: 3 types breed => 3 newborn types => 2 bonus points
    t.testBoard(game, {
      round: 5,
      dennis: {
        bonusPoints: 2,
        food: 8, // 10 + 2 (Day Laborer) - 4 (feeding)
        clay: 1, // Clay Pit accumulates 1
        animals: { sheep: 3, boar: 3, cattle: 3 },
        occupations: ['champion-breeder-e133'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }, { row: 0, col: 3 }], sheep: 3 },
            { spaces: [{ row: 1, col: 2 }, { row: 1, col: 3 }], boar: 3 },
            { spaces: [{ row: 2, col: 2 }, { row: 2, col: 3 }], cattle: 3 },
          ],
        },
      },
    })
  })
})
