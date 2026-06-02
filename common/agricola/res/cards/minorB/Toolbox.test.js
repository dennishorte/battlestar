const t = require('../../../testutil_v2.js')

describe('Toolbox', () => {
  test('no offer when player cannot afford any workshop', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['toolbox-b027'],
        wood: 7,
        reed: 2,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })
    // After one pasture, game asks to continue
    t.choose(game, 'Done building fences')
    // After fencing done, Toolbox checks for Joinery/Pottery/Basketmaker's Workshop
    // All cost stone — player has none → no prompt

    t.testBoard(game, {
      dennis: {
        wood: 3,   // 7 - 4 (fences for 1-space pasture)
        reed: 2,
        minorImprovements: ['toolbox-b027'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })

  test('builds Joinery when affordable after building fences', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['toolbox-b027'],
        wood: 6,
        stone: 2,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })
    t.choose(game, 'Done building fences')
    // Toolbox offers Joinery (2 wood, 2 stone)
    t.choose(game, 'Joinery (joinery)')

    t.testBoard(game, {
      dennis: {
        wood: 0,   // 6 - 4 (fences) - 2 (joinery)
        stone: 0,  // 2 - 2 (joinery)
        minorImprovements: ['toolbox-b027'],
        majorImprovements: ['joinery'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })

  test('can decline to build major improvement', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['toolbox-b027'],
        wood: 6,
        stone: 2,
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 0 }] })
    t.choose(game, 'Done building fences')
    t.choose(game, 'Do not build')

    t.testBoard(game, {
      dennis: {
        wood: 2,   // 6 - 4 (fences)
        stone: 2,
        minorImprovements: ['toolbox-b027'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
          ],
        },
      },
    })
  })
})
