const t = require('../../../testutil_v2.js')

describe('Bricklayer', () => {
  // Card text: "Each improvement and each renovation costs you 1 clay less.
  // Each room costs you 2 clay less."

  test('reduces clay cost of major improvement by 1', () => {
    // Pottery normally costs 2 clay + 2 stone. With Bricklayer: 1 clay + 2 stone.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Major Improvement'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        clay: 1,
        stone: 2,
      },
    })
    game.run()

    t.choose(game, 'Major Improvement')
    t.choose(game, 'Major Improvement.Pottery (pottery)')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        majorImprovements: ['pottery'],
        clay: 0,
        stone: 0,
      },
    })
  })

  test('reduces clay cost of renovation by 1', () => {
    // Renovate wood→clay: normally 2 clay + 1 reed (2 rooms).
    // With Bricklayer: 1 clay + 1 reed.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'Basic Wish for Children', 'Western Quarry', 'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'wood',
        clay: 1,
        reed: 1,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['bricklayer-c122'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
      },
    })
  })

  test.todo('modifyRoomCost reduces clay for rooms - hook not fired by engine')
})
