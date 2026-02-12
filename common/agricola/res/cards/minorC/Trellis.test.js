const t = require('../../../testutil_v2.js')

describe('Trellis', () => {
  test('build fences before Pig Market', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Pig Market'],
      dennis: {
        wood: 4,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['trellis-c015'],
      },
    })
    game.run()

    t.choose(game, 'Pig Market')
    // onBeforeAction fires → Trellis
    t.choose(game, 'Build Fences')
    t.action(game, 'build-pasture', { spaces: [{ row: 2, col: 4 }] })
    // wood = 0 after 4 fences → loop exits automatically
    // Pig Market executes (2 boar) → auto-placed in new pasture (capacity 2)

    t.testBoard(game, {
      dennis: {
        // wood: 0 (4 - 4 fences)
        animals: { boar: 2 },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['trellis-c015'],
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 4 }], boar: 2 }],
        },
      },
    })
  })

  test('skip fence building', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Pig Market'],
      dennis: {
        wood: 4,
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['trellis-c015'],
      },
    })
    game.run()

    t.choose(game, 'Pig Market')
    t.choose(game, 'Skip')
    // 2 boar arrive but pet slot holds only 1 → overflow
    t.choose(game, 'Place Animals')

    t.testBoard(game, {
      dennis: {
        wood: 4,
        pet: 'boar',
        animals: { boar: 1 },
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['trellis-c015'],
      },
    })
  })
})
