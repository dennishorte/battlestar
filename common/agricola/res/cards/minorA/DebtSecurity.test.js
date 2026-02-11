const t = require('../../../testutil_v2.js')

describe('Debt Security', () => {
  test('gives 1 bonus point per major improvement, up to unused spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['debt-security-a031'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 2 majors, 13 unused spaces → min(2,13) = 2 bonus pts
    // Score: fields(0)=-1, pastures(0)=-1, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(2 wood)=0,
    //   family(2)=6, unused(13)=-13, cardPts=3(1+2), bonus=2
    //   Total = -7 + 6 - 13 + 3 + 2 = -9
    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer gives 2
        minorImprovements: ['debt-security-a031'],
        majorImprovements: ['fireplace-2', 'clay-oven'],
        score: -9,
      },
    })
  })

  test('limited by unused spaces when farmyard is mostly full', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['debt-security-a031'],
        majorImprovements: ['fireplace-2', 'clay-oven', 'stone-oven'],
        farmyard: {
          rooms: [{ row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 3 majors but only 1 unused space (2,4) → min(3,1) = 1 bonus pt
    // 3 rooms + 11 fields = 14 used, 1 unused
    // Score: fields(11)=4, pastures(0)=-1, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(3 wood)=0,
    //   family(2)=6, unused(1)=-1, cardPts=6(1+2+3), bonus=1
    //   Total = -2 + 6 - 1 + 6 + 1 = 10
    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['debt-security-a031'],
        majorImprovements: ['fireplace-2', 'clay-oven', 'stone-oven'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
          fields: [
            { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 },
            { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
            { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
          ],
        },
        score: 10,
      },
    })
  })

  test('gives 0 when no major improvements', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['debt-security-a031'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 0 majors → 0 bonus pts
    // Score: fields(0)=-1, pastures(0)=-1, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(2 wood)=0,
    //   family(2)=6, unused(13)=-13, cardPts=0, bonus=0
    //   Total = -7 + 6 - 13 + 0 + 0 = -14
    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['debt-security-a031'],
        score: -14,
      },
    })
  })
})
