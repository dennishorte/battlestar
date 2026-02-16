const t = require('../../../testutil_v2.js')

describe('Field Doctor', () => {
  test('card can be played without crashing and initializes state', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['field-doctor-e092'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Field Doctor')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        occupations: ['field-doctor-e092'],
      },
    })

    // Verify card state was initialized
    const cardState = game.cardState('field-doctor-e092')
    expect(cardState.used).toBe(false)
  })

  test('allows family growth without room when 2 rooms surrounded by 4 fields', () => {
    const game = t.fixture({ cardSets: ['occupationE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Urgent Wish for Children'],
      dennis: {
        occupations: ['field-doctor-e092'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const dennis = game.players.byName('dennis')
      // Rearrange farmyard: rooms at (0,1) and (1,0)
      // Adjacent to (0,1): (0,0), (0,2), (1,1)
      // Adjacent to (1,0): (2,0), (1,1)
      // Unique adjacent cells: (0,0), (0,2), (1,1), (2,0) — 4 fields!
      dennis.farmyard.grid[0][0] = { type: 'field', crop: null, cropCount: 0 }
      dennis.farmyard.grid[0][1] = { type: 'room', roomType: 'wood' }
      dennis.farmyard.grid[0][2] = { type: 'field', crop: null, cropCount: 0 }
      dennis.farmyard.grid[1][1] = { type: 'field', crop: null, cropCount: 0 }
      dennis.farmyard.grid[2][0] = { type: 'field', crop: null, cropCount: 0 }
      // Initialize card state (setBoard skips onPlay)
      game.cardState('field-doctor-e092').used = false
    })
    game.run()

    // Dennis uses Urgent Wish for Children — no room available, but FieldDoctor allows it
    // because he has exactly 2 rooms surrounded by 4 field tiles
    t.choose(game, 'Urgent Wish for Children')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 10,
        familyMembers: 3,
        occupations: ['field-doctor-e092'],
        farmyard: {
          rooms: [{ row: 0, col: 1 }, { row: 1, col: 0 }],
          fields: [
            { row: 0, col: 0 },
            { row: 0, col: 2 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
          ],
        },
      },
    })
  })
})
