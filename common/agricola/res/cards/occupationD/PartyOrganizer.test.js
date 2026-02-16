const t = require('../../../testutil_v2.js')

test('scores 3 VP if only player with 5 people', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['party-organizer-d157'],
      familyMembers: 5,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
      },
    },
  })
  game.run()
  // Game pauses at first action choice. Check score at current state.
  // Categories (all 0): -7. Unused: 10 spaces × -1 = -10.
  // Family: 5 × 3 = 15. PartyOrganizer: 3 VP (only player with 5).
  // Total: -7 - 10 + 15 + 3 = 1
  t.testBoard(game, {
    dennis: {
      occupations: ['party-organizer-d157'],
      familyMembers: 5,
      score: 1,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
      },
    },
  })
})
