const t = require('../../../testutil_v2.js')

describe('Organic Farmer', () => {
  // Card text: "During scoring, you get 1 bonus point for each pasture
  // containing at least 1 animal while having unused capacity for at least
  // three more animals."
  // Uses getEndGamePoints hook. Card is 1+ players.

  test('scores 1 BP for pasture with animal and 3+ spare capacity', () => {
    // A 2-space pasture has capacity 4. 1 sheep in it → spare 3 → qualifies.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['organic-farmer-b098'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    // fields:-1 pastures:1 grain:-1 veg:-1 sheep:1 boar:-1 cattle:-1
    // rooms:0(2wood) family:6 unused:-11(15-2-2) cardPts:0
    // bonusPts: 1(OrganicFarmer)
    // Total: -1+1-1-1+1-1-1+0+6-11+0+1 = -7
    t.testBoard(game, {
      dennis: {
        occupations: ['organic-farmer-b098'],
        animals: { sheep: 1 },
        score: -7,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
  })

  test('does not score for pasture with no animals', () => {
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['organic-farmer-b098'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
      },
    })
    game.run()

    // fields:-1 pastures:1 grain:-1 veg:-1 sheep:-1 boar:-1 cattle:-1
    // rooms:0(2wood) family:6 unused:-11(15-2-2) cardPts:0 bonusPts:0
    // Total: -1+1-1-1-1-1-1+0+6-11+0+0 = -10
    t.testBoard(game, {
      dennis: {
        occupations: ['organic-farmer-b098'],
        score: -10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
          ],
        },
      },
    })
  })

  test('does not score for pasture with less than 3 spare capacity', () => {
    // 1-space pasture has capacity 2. 1 sheep → spare 1 → doesn't qualify.
    const game = t.fixture({ numPlayers: 2 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['organic-farmer-b098'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], sheep: 1 },
          ],
        },
      },
    })
    game.run()

    // fields:-1 pastures:1 grain:-1 veg:-1 sheep:1 boar:-1 cattle:-1
    // rooms:0(2wood) family:6 unused:-12(15-2-1) cardPts:0 bonusPts:0
    // Total: -1+1-1-1+1-1-1+0+6-12+0+0 = -9
    t.testBoard(game, {
      dennis: {
        occupations: ['organic-farmer-b098'],
        animals: { sheep: 1 },
        score: -9,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }], sheep: 1 },
          ],
        },
      },
    })
  })
})
