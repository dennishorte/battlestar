const t = require('../../../testutil_v2.js')

describe('Summer House', () => {
  test('2 bonus points per unused space adjacent to house in stone house', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['summer-house-d033'],
        roomType: 'wood',  // prereq: wood house when played
        // Default rooms at (0,0) and (1,0)
      },
    })
    game.run()

    // Upgrade to stone to trigger the scoring bonus
    const dennis = game.players.byName('dennis')
    dennis.roomType = 'stone'
    for (const room of dennis.getRoomSpaces()) {
      dennis.farmyard.grid[room.row][room.col].roomType = 'stone'
    }

    const card = dennis.cards.byId('summer-house-d033')
    // Rooms at (0,0) and (1,0). Adjacent spaces:
    // (0,0) → (0,1), (1,0)[room]
    // (1,0) → (0,0)[room], (1,1), (2,0)
    // Unique non-room adjacent: (0,1), (1,1), (2,0) = 3 unused spaces
    expect(card.callHook('getEndGamePoints', dennis)).toBe(6)  // 3 * 2
  })

  test('no points if not stone house', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['summer-house-d033'],
        roomType: 'wood',
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const card = dennis.cards.byId('summer-house-d033')
    expect(card.callHook('getEndGamePoints', dennis)).toBe(0)
  })
})
