const t = require('../../../testutil_v2.js')

describe('Wares Salesman', () => {
  test('gives wood and reed when any player builds Joinery', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['wares-salesman-e144'],
        wood: 0,
        reed: 0,
      },
      micah: {
        wood: 2,
        stone: 2, // Joinery costs 2 wood, 2 stone
      },
    })
    game.run()

    // Micah builds Joinery -> WaresSalesman fires for Dennis
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Joinery (joinery)')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 1,  // from WaresSalesman (craft = wood)
        reed: 1,  // from WaresSalesman
        occupations: ['wares-salesman-e144'],
      },
      micah: {
        wood: 0,  // spent on Joinery
        stone: 0, // spent on Joinery
        majorImprovements: ['joinery'],
      },
    })
  })

  test('gives clay and reed when any player builds Pottery', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['wares-salesman-e144'],
        clay: 0,
        reed: 0,
      },
      micah: {
        clay: 2,
        stone: 2, // Pottery costs 2 clay, 2 stone
      },
    })
    game.run()

    // Micah builds Pottery -> WaresSalesman fires for Dennis
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        clay: 1,  // from WaresSalesman (craft = clay)
        reed: 1,  // from WaresSalesman
        occupations: ['wares-salesman-e144'],
      },
      micah: {
        clay: 0,
        stone: 0,
        majorImprovements: ['pottery'],
      },
    })
  })
})
