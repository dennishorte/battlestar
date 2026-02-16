const t = require('../../../testutil_v2.js')

describe('Master Renovator', () => {
  test('offers discounted renovation at end of round 7 work phase', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-renovator-e087'],
        // Renovation wood->clay: 2 clay + 1 reed for 2 rooms
        // With discount: get 1 free clay -> need only 1 clay + 1 reed
        clay: 1, reed: 1,
        food: 4, // for feeding (2 people = 4 food)
      },
    })
    game.run()

    // 4 actions in round 7
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // End of work phase: MasterRenovator fires
    // Cannot afford normally (need 2 clay + 1 reed, have 1 clay + 1 reed)
    // But can afford with 1 free clay
    t.choose(game, 'Get 1 free clay and renovate')

    // Harvest: feeding (4 - 4 = 0)

    t.testBoard(game, {
      dennis: {
        clay: 0,  // 1 + 1 free - 2 renovation
        reed: 0,  // 1 - 1 renovation
        food: 0,  // 4 - 4 feeding
        grain: 1,
        roomType: 'clay',
        occupations: ['master-renovator-e087'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('offers discount choice when can already afford renovation', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-renovator-e087'],
        clay: 3, reed: 2, // more than needed
        food: 4,
      },
    })
    game.run()

    // 4 actions
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // MasterRenovator: can afford -> choose discount
    t.choose(game, 'Get 1 free clay')
    // Renovation: costs 2 clay + 1 reed. Player gets +1 clay, then pays 2 clay + 1 reed.
    // Net: 3 + 1 - 2 = 2 clay, 2 - 1 = 1 reed

    t.testBoard(game, {
      dennis: {
        clay: 2,  // 3 + 1 free - 2 renovation
        reed: 1,  // 2 - 1 renovation
        food: 0,
        grain: 1,
        roomType: 'clay',
        occupations: ['master-renovator-e087'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('does not trigger in non-qualifying rounds', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 4, // not round 7 or 9
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-renovator-e087'],
        clay: 5, reed: 2,
        food: 4,
      },
    })
    game.run()

    // 4 actions in round 4
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // End of work phase: round 4, NOT 7 or 9 -> no trigger

    t.testBoard(game, {
      dennis: {
        clay: 5,
        reed: 2,
        food: 0,  // 4 - 4 feeding
        grain: 1,
        roomType: 'wood',
        occupations: ['master-renovator-e087'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })

  test('does nothing when cannot afford even with discount', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      round: 7,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['master-renovator-e087'],
        clay: 0, reed: 0, // cannot afford even with discount
        food: 4,
      },
    })
    game.run()

    // 4 actions
    t.choose(game, 'Grain Seeds')  // dennis
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Farmland')     // dennis
    t.choose(game, '0,2')
    t.choose(game, 'Reed Bank')    // micah

    // MasterRenovator: cannot afford even with +1 of any resource -> no trigger

    t.testBoard(game, {
      dennis: {
        roomType: 'wood',
        food: 0,
        grain: 1,
        occupations: ['master-renovator-e087'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })
  })
})
