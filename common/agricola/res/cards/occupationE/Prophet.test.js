const t = require('../../../testutil_v2.js')

describe('Prophet', () => {
  test('onPlay offers renovation then fences', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['prophet-e094'],
        clay: 2, reed: 1, // renovation cost: 2 clay + 1 reed (2 rooms, wood->clay)
        wood: 4, // for fences (4 fences for corner pasture)
      },
    })
    game.run()

    // Play Prophet via Lessons A
    t.choose(game, 'Lessons A')
    t.choose(game, 'Prophet')
    // Prophet onPlay: renovation
    // Renovates wood -> clay (costs 2 clay + 1 reed)
    // Then offers fences
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // 4 fences for corner, but only has 4 wood -> auto-exits

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0,  // 2 - 2 renovation
        reed: 0,  // 1 - 1 renovation
        wood: 0,  // 4 - 4 fences
        roomType: 'clay',
        occupations: ['prophet-e094'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
      },
    })
  })

  test('onPlay renovates but skips fences when no wood', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['prophet-e094'],
        clay: 2, reed: 1,
        wood: 0, // no wood for fences
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Prophet')
    // Renovates wood -> clay
    // No wood -> cannot build fences, auto-skipped

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        clay: 0,
        reed: 0,
        roomType: 'clay',
        occupations: ['prophet-e094'],
      },
    })
  })

  test('onPlay skips renovation when cannot afford, still offers fences', () => {
    const game = t.fixture({ cardSets: ['occupationE'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['prophet-e094'],
        clay: 0, reed: 0, // cannot afford renovation
        wood: 4, // for fences
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Prophet')
    // Cannot renovate -> logs message
    // Offers fences -> build a pasture
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        roomType: 'wood',
        occupations: ['prophet-e094'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          fences: 4,
        },
      },
    })
  })
})
