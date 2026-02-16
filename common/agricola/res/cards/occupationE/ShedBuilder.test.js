const t = require('../../../testutil_v2.js')

describe('Shed Builder', () => {
  test('gives 1 grain per stable for 1st and 2nd stable', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['shed-builder-e114'],
        wood: 4, // 2 stables at 2 wood each
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('shed-builder-e114').stablesBuiltSincePlay = 0
    })
    game.run()

    // Dennis builds 2 stables via Farm Expansion
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 0, col: 1 })
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })
    // Loop auto-exits: 0 wood remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        grain: 2, // 1 per stable
        occupations: ['shed-builder-e114'],
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
      },
    })
  })

  test('gives 1 vegetable per stable for 3rd and 4th stable', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['shed-builder-e114'],
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }],
        },
        wood: 4, // 2 more stables
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('shed-builder-e114').stablesBuiltSincePlay = 2
    })
    game.run()

    // Dennis builds 3rd and 4th stables
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 0, col: 2 })
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 2 })
    // Loop auto-exits: 0 wood remaining

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,
        vegetables: 2, // 1 per stable for 3rd and 4th
        occupations: ['shed-builder-e114'],
        farmyard: {
          stables: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 2 }],
        },
      },
    })
  })
})
