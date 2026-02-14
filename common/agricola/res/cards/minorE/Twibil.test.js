const t = require('../../../testutil_v2.js')

describe('Twibil', () => {
  test('gives 1 food when building a wood room', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['twibil-e049'],
        wood: 5,
        reed: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis takes Farm Expansion → build wood room
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Twibil
        minorImprovements: ['twibil-e049'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }],
        },
      },
    })
  })

  test('no food when building non-wood room', () => {
    const game = t.fixture({ cardSets: ['minorImprovementE', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['twibil-e049'],
        roomType: 'clay',
        clay: 5,
        reed: 2,
      },
      micah: { food: 10 },
    })
    game.run()

    // Dennis takes Farm Expansion → build clay room
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        food: 0,
        roomType: 'clay',
        minorImprovements: ['twibil-e049'],
        farmyard: {
          rooms: [{ row: 0, col: 0, type: 'clay' }, { row: 0, col: 1, type: 'clay' }, { row: 1, col: 0, type: 'clay' }],
        },
      },
    })
  })
})
