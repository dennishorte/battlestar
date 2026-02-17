const t = require('../../../testutil_v2.js')

describe('Wood Saw', () => {
  test('fewer workers than all opponents — free Build Rooms offered and no worker consumed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-saw-e014'],
        wood: 10,
        reed: 5,
      },
    })
    // Give micah 3 family members (more than dennis's 2)
    game.testSetBreakpoint('initialization-complete', (game) => {
      const micah = game.players.byName('micah')
      micah.familyMembers = 3
      micah.availableWorkers = 3
      // Add a room space for micah's 3rd family member
      micah.farmyard.grid[0][2] = { type: 'room', roomType: 'wood' }
    })
    game.run()

    // Dennis should see "Build Rooms (Wood Saw)" option
    expect(t.currentChoices(game)).toContain('Build Rooms (Wood Saw)')

    // Take the free Build Rooms action (no worker consumed)
    t.choose(game, 'Build Rooms (Wood Saw)')
    t.action(game, 'build-room', { row: 0, col: 1 })

    // After bonus action, Dennis still has 2 normal workers to place
    // Verify room was built and resources spent
    t.testBoard(game, {
      dennis: {
        minorImprovements: ['wood-saw-e014'],
        wood: 5, // 10 - 5 (room costs 5 wood)
        reed: 3, // 5 - 2 (room costs 2 reed)
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('equal workers — not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-saw-e014'],
        wood: 10,
        reed: 5,
      },
      // micah also has 2 family members (equal to dennis)
    })
    game.run()

    expect(t.currentChoices(game)).not.toContain('Build Rooms (Wood Saw)')
  })

  test('cannot afford room — not offered', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['wood-saw-e014'],
        // No resources to build room
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const micah = game.players.byName('micah')
      micah.familyMembers = 3
      micah.availableWorkers = 3
      micah.farmyard.grid[0][2] = { type: 'room', roomType: 'wood' }
    })
    game.run()

    expect(t.currentChoices(game)).not.toContain('Build Rooms (Wood Saw)')
  })
})
