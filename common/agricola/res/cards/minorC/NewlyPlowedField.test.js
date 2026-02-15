const t = require('../../../testutil_v2.js')

describe('Newly-Plowed Field', () => {
  test('allows plowing a field not adjacent to existing fields', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        farmyard: {
          // Default rooms at (0,0) and (1,0); 3 adjacent fields in top row
          fields: [
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
          ],
        },
        hand: ['newly-plowed-field-c017'],
      },
    })
    game.run()

    // Dennis plays Newly-Plowed Field (prereq: exactly 3 fields)
    t.choose(game, 'Major Improvement')
    t.choose(game, 'Minor Improvement.Newly-Plowed Field')
    // Choose a non-adjacent space (row 2, col 4 — not adjacent to any existing field)
    t.choose(game, '2,4')

    t.testBoard(game, {
      dennis: {
        minorImprovements: ['newly-plowed-field-c017'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },
            { row: 0, col: 3 },
            { row: 0, col: 4 },
            { row: 2, col: 4 },
          ],
        },
      },
    })
  })

  test('requires exactly 3 fields prereq', () => {
    const game = t.fixture({ cardSets: ['minorC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Major Improvement'],
      dennis: {
        farmyard: {
          fields: [
            { row: 0, col: 2 },
            { row: 0, col: 3 },
          ],
        },
        hand: ['newly-plowed-field-c017'],
      },
    })
    game.run()

    // Dennis takes Major Improvement — card should not be playable (only 2 fields)
    // With no affordable majors and only unplayable minors, improvement is auto-skipped
    t.choose(game, 'Major Improvement')

    t.testBoard(game, {
      dennis: {
        hand: ['newly-plowed-field-c017'],
        farmyard: {
          fields: [
            { row: 0, col: 2 },
            { row: 0, col: 3 },
          ],
        },
      },
    })
  })
})
