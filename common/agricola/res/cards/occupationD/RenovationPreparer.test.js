const t = require('../../../testutil_v2.js')

describe('Renovation Preparer', () => {
  test('gives 2 clay when building a wood room', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['renovation-preparer-d123'],
        roomType: 'wood',
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        wood: 0,  // 5 - 5
        reed: 0,  // 2 - 2
        clay: 2,  // from Renovation Preparer
        roomType: 'wood',
        occupations: ['renovation-preparer-d123'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('gives 2 stone when building a clay room', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['renovation-preparer-d123'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        clay: 0,   // 5 - 5
        reed: 0,   // 2 - 2
        stone: 2,  // from Renovation Preparer
        roomType: 'clay',
        occupations: ['renovation-preparer-d123'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('does not give resources when building a stone room', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Farm Expansion'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['renovation-preparer-d123'],
        roomType: 'stone',
        stone: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        stone: 0,  // 5 - 5
        reed: 0,   // 2 - 2
        clay: 0,   // no bonus
        roomType: 'stone',
        occupations: ['renovation-preparer-d123'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })
})
