const t = require('../../../testutil_v2.js')

describe('Housemaster', () => {
  // Card text: "During scoring, total the values of your major improvements.
  // The smallest value counts double. If the total is at least 5/7/9/11,
  // you get 1/2/3/4 bonus points."
  // Uses getEndGamePoints hook. Card is 3+ players.

  test('scores 1 BP when major improvement total >= 5', () => {
    // Joinery(2VP) + Pottery(2VP) = 4, smallest=2, total=4+2=6 → 1 BP (>=5)
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['housemaster-b153'],
        majorImprovements: ['joinery', 'pottery'],
      },
    })
    game.run()

    // Score: fields:-1 pastures:-1 grain:-1 veg:-1 sheep:-1 boar:-1 cattle:-1
    //        rooms:0(2wood) family:6 unused:-13
    //        cardPts:4(joinery:2 + pottery:2)
    //        bonusPts:1(Housemaster: total 6 >= 5)
    // Total: -7+0+6-13+4+1 = -9
    t.testBoard(game, {
      dennis: {
        occupations: ['housemaster-b153'],
        majorImprovements: ['joinery', 'pottery'],
        score: -9,
      },
    })
  })

  test('scores 0 when total < 5', () => {
    // Fireplace(1VP) only → 1, smallest=1, total=1+1=2 → 0 BP (<5)
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['housemaster-b153'],
        majorImprovements: ['fireplace-2'],
      },
    })
    game.run()

    // Score: fields:-1 pastures:-1 grain:-1 veg:-1 sheep:-1 boar:-1 cattle:-1
    //        rooms:0(2wood) family:6 unused:-13
    //        cardPts:1(fireplace:1)
    //        bonusPts:0(Housemaster: total 2 < 5)
    // Total: -7+0+6-13+1+0 = -13
    t.testBoard(game, {
      dennis: {
        occupations: ['housemaster-b153'],
        majorImprovements: ['fireplace-2'],
        score: -13,
      },
    })
  })

  test('scores 0 with no major improvements', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['housemaster-b153'],
      },
    })
    game.run()

    // Score: default -14 + 0(Housemaster: no majors)
    t.testBoard(game, {
      dennis: {
        occupations: ['housemaster-b153'],
        score: -14,
      },
    })
  })
})
