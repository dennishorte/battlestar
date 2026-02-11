const t = require('../../../testutil_v2.js')

describe('Manger', () => {
  test('6 pasture spaces gives 1 bonus point', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }] },
            { spaces: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 6 pasture spaces → 1 bonus pt
    // Score: fields(0)=-1, pastures(2)=2, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(2 wood)=0,
    //   family(2)=6, unused(7)=-7, cardPts=0, bonus=1
    //   Total = -4 + 6 - 7 + 0 + 1 = -4
    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }] },
            { spaces: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }] },
          ],
        },
        score: -4,
      },
    })
  })

  test('10 pasture spaces gives 4 bonus points', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }] },
            { spaces: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 10 pasture spaces → 4 bonus pts
    // Score: fields(0)=-1, pastures(2)=2, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(2 wood)=0,
    //   family(2)=6, unused(3)=-3, cardPts=0, bonus=4
    //   Total = -4 + 6 - 3 + 0 + 4 = 3
    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 1, col: 4 }] },
            { spaces: [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 2, col: 4 }] },
          ],
        },
        score: 3,
      },
    })
  })

  test('4 pasture spaces gives 0 bonus points', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 11,
      dennis: {
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    // 4 pasture spaces → 0 bonus pts
    // Score: fields(0)=-1, pastures(1)=1, grain(0)=-1, veg(0)=-1,
    //   sheep(0)=-1, boar(0)=-1, cattle(0)=-1, rooms(2 wood)=0,
    //   family(2)=6, unused(9)=-9, cardPts=0, bonus=0
    //   Total = -5 + 6 - 9 + 0 + 0 = -8
    t.testBoard(game, {
      dennis: {
        food: 2,
        minorImprovements: ['manger-a032'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 1 }, { row: 1, col: 2 }] },
          ],
        },
        score: -8,
      },
    })
  })
})
