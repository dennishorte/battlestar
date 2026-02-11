const t = require('../../../testutil_v2.js')

describe('Stable Tree', () => {
  test('schedules wood on next 3 round spaces when building a stable', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stable-tree-a074'],
        wood: 2, // stable cost
      },
    })
    game.run()

    // dennis: Farm Expansion → Build Stable
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    // Verify scheduled wood on rounds 3, 4, 5 (current round is 2)
    // Check mid-round before collection can happen
    expect(game.state.scheduledWood.dennis[3]).toBe(1)
    expect(game.state.scheduledWood.dennis[4]).toBe(1)
    expect(game.state.scheduledWood.dennis[5]).toBe(1)

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    t.testBoard(game, {
      dennis: {
        wood: 1, // round 3 scheduled wood collected
        food: 2, // Day Laborer
        scheduled: { wood: { 4: 1, 5: 1 } },
        minorImprovements: ['stable-tree-a074'],
        farmyard: {
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })

  test('does not schedule wood past round 14', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['stable-tree-a074'],
        wood: 2,
        food: 10,
      },
      micah: { food: 10 },
      round: 13,
    })
    game.run()

    // Round 13 (harvest round): build a stable
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    // Check scheduled wood immediately (mid-round, before harvest/collection)
    // Round 13: only round 14 is valid (15 and 16 exceed game length)
    expect(game.state.scheduledWood.dennis[14]).toBe(1)
    expect(game.state.scheduledWood.dennis[15]).toBeUndefined()
    expect(game.state.scheduledWood.dennis[16]).toBeUndefined()

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah
  })
})
