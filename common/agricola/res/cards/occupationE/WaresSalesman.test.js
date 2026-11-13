const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

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

  test('gives wood and reed when any player plays Basket', () => {
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
        hand: ['basket-a056'],
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Basket')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 1,
        reed: 1,
        occupations: ['wares-salesman-e144'],
      },
      micah: {
        reed: 0,
        hand: [],
        minorImprovements: ['basket-a056'],
      },
    })
  })

  test('lets the owner choose the resource when the card converts more than one', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['wares-salesman-e144'],
        stone: 0,
        reed: 0,
      },
      micah: {
        hand: ['studio-c055'],
        clay: 1,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Studio')
    t.choose(game, '1 stone')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        stone: 1,
        reed: 1,
        occupations: ['wares-salesman-e144'],
      },
      micah: {
        clay: 0,
        reed: 0,
        hand: [],
        minorImprovements: ['studio-c055'],
      },
    })
  })

  test('does nothing when the improvement does not turn a building resource into food', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'micah',
      dennis: {
        occupations: ['wares-salesman-e144'],
        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,
      },
      micah: {
        hand: ['test-minor-1'],
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Test Minor 1')

    t.testBoard(game, {
      currentPlayer: 'dennis',
      dennis: {
        wood: 0,
        clay: 0,
        reed: 0,
        stone: 0,
        occupations: ['wares-salesman-e144'],
      },
      micah: {
        hand: [],
        minorImprovements: ['test-minor-1'],
      },
    })
  })

  test('names the building resource each converting improvement turns into food', () => {
    const expected = {
      'joinery': 'wood',
      'joinery-2': 'wood',
      'pottery': 'clay',
      'pottery-2': 'clay',
      'basketmakers-workshop': 'reed',
      'basketmakers-workshop-2': 'reed',
      'loppers-a034': 'wood',
      'shaving-horse-a048': 'wood',
      'basket-a056': 'wood',
      'forest-inn-b042': 'wood',
      'potters-yard-a040': 'clay',
      'large-pottery-d060': 'clay',
      'paintbrush-e039': 'clay',
      'pellet-press-d046': 'reed',
      'sculpture-course-b053': ['wood', 'stone'],
      'studio-c055': ['wood', 'clay', 'stone'],
      'contraband-e054': ['wood', 'clay', 'reed', 'stone'],
    }

    for (const [id, resources] of Object.entries(expected)) {
      expect(res.getCardById(id).buildingResourceToFood).toEqual(resources)
    }
    expect(res.getCardById('beer-stall-c049').buildingResourceToFood).toBeUndefined()
  })
})
