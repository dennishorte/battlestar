const t = require('../../../testutil_v2.js')

describe('Swing Plow', () => {
  test('plows extra fields on Farmland — charges decrease', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        minorImprovements: ['swing-plow-c019'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('swing-plow-c019').charges = 4
    })
    game.run()

    // Dennis takes Farmland → plows 1 field, then onAction offers 2 more
    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // Regular plow
    t.choose(game, 'Plow a field from Swing Plow (4 remaining)')
    t.choose(game, '0,3') // Extra plow 1
    t.choose(game, 'Plow a field from Swing Plow (3 remaining)')
    t.choose(game, '0,4') // Extra plow 2

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['swing-plow-c019'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
      },
    })

    expect(game.cardState('swing-plow-c019').charges).toBe(2)
  })

  test('player can skip extra plows', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        minorImprovements: ['swing-plow-c019'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('swing-plow-c019').charges = 4
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // Regular plow
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['swing-plow-c019'],
        farmyard: {
          fields: [{ row: 0, col: 2 }],
        },
      },
    })

    expect(game.cardState('swing-plow-c019').charges).toBe(4)
  })

  test('does NOT trigger on Cultivation', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Cultivation'],
      dennis: {
        minorImprovements: ['swing-plow-c019'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('swing-plow-c019').charges = 4
    })
    game.run()

    // Take Cultivation (plow-sow) — Swing Plow should NOT trigger
    t.choose(game, 'Cultivation')
    t.choose(game, 'Plow a field')
    t.choose(game, '0,2')

    // No Swing Plow prompt should appear — charges remain at 4
    expect(game.cardState('swing-plow-c019').charges).toBe(4)
  })
})
