const t = require('../../../testutil_v2.js')

describe('Stablehand', () => {
  test('offers free stable after building fences', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stablehand-d089'],
        wood: 4, // 4 fences for a 1-space corner pasture
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // 4 wood used -> 0 remaining -> fencing auto-exits
    // onBuildFences fires -> Stablehand offers free stable
    t.choose(game, '2,0') // build stable at (2,0)

    t.testBoard(game, {
      dennis: {
        occupations: ['stablehand-d089'],
        wood: 0, // 4 - 4 fences
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
          stables: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('can skip the free stable offer', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['stablehand-d089'],
        wood: 4,
      },
    })
    game.run()

    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })
    // Stablehand fires -> skip
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['stablehand-d089'],
        wood: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })
})
