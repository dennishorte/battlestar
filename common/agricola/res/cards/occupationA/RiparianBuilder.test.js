const t = require('../../../testutil_v2.js')

describe('Riparian Builder', () => {
  test('onAnyAction offers to build room with clay discount when another player uses Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['Reed Bank'],
      dennis: {
        occupations: ['riparian-builder-a128'],
        roomType: 'clay',
        clay: 4,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')   // micah uses Reed Bank → Riparian Builder offers dennis
    t.choose(game, 'Build a room')
    t.choose(game, '0,1')        // dennis builds at (0,1); cost 4 clay, 2 reed (discount 1 clay)

    t.testBoard(game, {
      dennis: {
        occupations: ['riparian-builder-a128'],
        roomType: 'clay',
        clay: 0,
        reed: 0,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }] },
      },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['Reed Bank'],
      dennis: {
        occupations: ['riparian-builder-a128'],
        roomType: 'clay',
        clay: 4,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['riparian-builder-a128'],
        roomType: 'clay',
        clay: 4,
        reed: 2,
      },
      micah: { reed: 1 },
    })
  })
})
