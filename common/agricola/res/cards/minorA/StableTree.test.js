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

    // Remaining workers
    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Verify scheduled wood on rounds 3, 4, 5 (current round is 2)
    expect(game.state.scheduledWood.dennis[3]).toBe(1)
    expect(game.state.scheduledWood.dennis[4]).toBe(1)
    expect(game.state.scheduledWood.dennis[5]).toBe(1)

    t.testBoard(game, {
      dennis: {
        food: 2, // Day Laborer
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
      round: 12,
    })
    game.run()

    // Round 13 (harvest round): build a stable
    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Stable')
    t.action(game, 'build-stable', { row: 1, col: 1 })

    t.choose(game, 'Forest')       // micah
    t.choose(game, 'Day Laborer')  // dennis
    t.choose(game, 'Clay Pit')     // micah

    // Round 13: scheduled wood for round 14 only
    expect(game.state.scheduledWood.dennis[14]).toBe(1)
    expect(game.state.scheduledWood.dennis[15]).toBeUndefined()
    expect(game.state.scheduledWood.dennis[16]).toBeUndefined()
  })
})
