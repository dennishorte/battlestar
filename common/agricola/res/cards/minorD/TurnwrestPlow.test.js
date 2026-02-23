const t = require('../../../testutil_v2.js')

describe('Turnwrest Plow', () => {
  test('plows extra field on Farmland', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        minorImprovements: ['turnwrest-plow-d020'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('turnwrest-plow-d020').charges = 2
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // Regular plow
    t.choose(game, 'Plow a field from Turnwrest Plow (2 remaining)')
    t.choose(game, '0,3') // Extra plow

    // 1 charge used, skip second
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['turnwrest-plow-d020'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })

    expect(game.cardState('turnwrest-plow-d020').charges).toBe(1)
  })

  test('plows extra field on Cultivation', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Cultivation'],
      dennis: {
        minorImprovements: ['turnwrest-plow-d020'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('turnwrest-plow-d020').charges = 2
    })
    game.run()

    t.choose(game, 'Cultivation')
    t.choose(game, 'Plow a field')
    t.choose(game, '0,2')

    // onAction fires with plow-sow → Turnwrest Plow triggers
    t.choose(game, 'Plow a field from Turnwrest Plow (2 remaining)')
    t.choose(game, '0,3')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['turnwrest-plow-d020'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })

    expect(game.cardState('turnwrest-plow-d020').charges).toBe(1)
  })

  test('respects charge limit — 1 charge means only 1 extra plow', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Farmland'],
      dennis: {
        minorImprovements: ['turnwrest-plow-d020'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('turnwrest-plow-d020').charges = 1
    })
    game.run()

    t.choose(game, 'Farmland')
    t.choose(game, '0,2') // Regular plow
    // Only 1 charge, so only 1 offer
    t.choose(game, 'Plow a field from Turnwrest Plow (1 remaining)')
    t.choose(game, '0,3')
    // No second offer — only 1 charge

    t.testBoard(game, {
      dennis: {
        occupations: ['test-occupation-1', 'test-occupation-2'],
        minorImprovements: ['turnwrest-plow-d020'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })

    expect(game.cardState('turnwrest-plow-d020').charges).toBe(0)
  })
})
