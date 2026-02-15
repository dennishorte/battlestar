const t = require('../../../testutil_v2.js')

describe('Zigzag Harrow', () => {
  test('prereq met with L-shaped fields, plows zigzag completion', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Meeting Place'],
      dennis: {
        hand: ['zigzag-harrow-d001'],
        occupations: ['test-occupation-1'],
        wood: 1,
        farmyard: {
          // L-shape: (0,2), (1,2), (1,3) — corner at (1,2) has both axes
          fields: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 1, col: 3 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Zigzag Harrow')
    // Zigzag completion: the 4th piece to form S/Z pattern
    // Existing: (0,2),(1,2),(1,3) → adding (2,3) forms S vertical shape
    t.choose(game, '2,3')

    t.testBoard(game, {
      dennis: {
        wood: 0,
        food: 1,
        occupations: ['test-occupation-1'],
        minorImprovements: ['zigzag-harrow-d001'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 2, col: 3 },
          ],
        },
      },
    })
  })

  test('prereq not met with fields in a line — card not playable', () => {
    const game = t.fixture({ cardSets: ['minorD', 'test'] })
    t.setBoard(game, {
      dennis: {
        hand: ['zigzag-harrow-d001'],
        wood: 1,
        farmyard: {
          // Straight line: (0,2), (0,3), (0,4) — no corner field
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        },
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.canPlayCard('zigzag-harrow-d001')).toBe(false)
  })
})
