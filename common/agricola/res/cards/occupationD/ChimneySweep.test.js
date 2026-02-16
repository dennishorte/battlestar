const t = require('../../../testutil_v2.js')

describe('Chimney Sweep', () => {
  // modifyRenovationCost: stone renovation -2 stone
  // getEndGamePoints: 1 VP per opponent in stone house

  test('renovation to stone costs 2 less stone', () => {
    // Clay to stone: normally 2 stone + 1 reed (2 rooms).
    // With Chimney Sweep: 0 stone + 1 reed.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['chimney-sweep-d154'],
        roomType: 'clay',
        stone: 0,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['chimney-sweep-d154'],
        roomType: 'stone',
        stone: 0,
        reed: 0,
      },
    })
  })

  test('does not affect clay renovation cost', () => {
    // Wood to clay: normally 2 clay + 1 reed (2 rooms).
    // Chimney Sweep only affects stone, so no discount.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['chimney-sweep-d154'],
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        occupations: ['chimney-sweep-d154'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
      },
    })
  })

  test('scores 1 VP per opponent in stone house', () => {
    // Base score: -14. Chimney Sweep bonus: 1 opponent in stone = 1 VP. Total: -13.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['chimney-sweep-d154'],
      },
      micah: {
        roomType: 'stone',
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -13,
        occupations: ['chimney-sweep-d154'],
      },
    })
  })

  test('scores 0 VP when no opponent in stone house', () => {
    // Base score: -14. No opponents in stone = 0 VP. Total: -14.
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['chimney-sweep-d154'],
      },
      micah: {
        roomType: 'clay',
      },
    })
    game.run()

    t.testBoard(game, {
      dennis: {
        score: -14,
        occupations: ['chimney-sweep-d154'],
      },
    })
  })
})
