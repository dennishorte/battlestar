const t = require('../../../testutil_v2.js')

describe('Margrave', () => {
  test('gets 2 food when any player renovates while in stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['margrave-e154'],
        roomType: 'stone',
      },
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1, // wood -> clay renovation cost (2 clay + 1 reed for 2 rooms)
      },
    })
    game.run()

    // Micah renovates wood -> clay
    t.choose(game, 'House Redevelopment')
    // No affordable improvements after spending resources

    t.testBoard(game, {
      dennis: {
        food: 2, // from Margrave
        roomType: 'stone',
        occupations: ['margrave-e154'],
      },
      micah: {
        roomType: 'clay',
        clay: 0,
        reed: 0,
      },
    })
  })

  test('does not get food if not in stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        occupations: ['margrave-e154'],
        roomType: 'wood', // not stone
      },
      micah: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    // Micah renovates
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        food: 0, // no bonus, not in stone house
        roomType: 'wood',
        occupations: ['margrave-e154'],
      },
      micah: {
        roomType: 'clay',
      },
    })
  })

  test('scoring: +1 VP per opponent with wood or clay house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['margrave-e154'],
        roomType: 'stone',
      },
      micah: {
        roomType: 'wood', // opponent in wood house
      },
    })
    game.run()

    // score includes Margrave's +1 VP (micah in wood house)
    // stone rooms: 2×2=4, family: 2×3=6, empty categories: -7, unused spaces: -13, Margrave: +1 = -9
    t.testBoard(game, {
      dennis: {
        score: -9,
        roomType: 'stone',
        occupations: ['margrave-e154'],
      },
    })
  })

  test('scoring: 0 VP if not in stone house', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['margrave-e154'],
        roomType: 'clay', // not stone
      },
      micah: {
        roomType: 'wood',
      },
    })
    game.run()

    // No Margrave scoring (not stone house)
    // clay rooms: 2×1=2, family: 2×3=6, empty categories: -7, unused spaces: -13 = -12
    t.testBoard(game, {
      dennis: {
        score: -12,
        roomType: 'clay',
        occupations: ['margrave-e154'],
      },
    })
  })
})
