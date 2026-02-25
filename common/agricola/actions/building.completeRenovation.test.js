const t = require('../testutil_v2.js')

describe('_completeRenovation', () => {
  test('free renovation: room type changes, no resources deducted', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-company-a013'],
        wood: 4, // card cost
        clay: 0,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Company')
    t.choose(game, 'Renovate from wood to clay for free')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        roomType: 'clay',
        wood: 0, // 4 - 4 card cost
        clay: 3, // 3 from onPlay, 0 spent on free renovation
        minorImprovements: ['renovation-company-a013'],
      },
    })
  })

  test('with cost: resources deducted correctly', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        roomType: 'wood',
        clay: 2, // wood→clay: 1 clay/room × 2 rooms
        reed: 1, // wood→clay: 1 reed total
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Improvement step auto-skips (no resources left)

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        clay: 0, // 2 - 2
        reed: 0, // 1 - 1
      },
    })
  })

  test('custom log template: log uses custom template', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-company-a013'],
        wood: 4,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Company')
    t.choose(game, 'Renovate from wood to clay for free')

    const logs = game.log.getLog().filter(e => e.template).map(e => e.template)
    expect(logs).toContain('{player} renovates from {old} to {new} for free using {card}')
  })

  test('onRenovate hooks fire on player cards (Roughcaster gives 3 food)', () => {
    const game = t.fixture({ cardSets: ['occupationA'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        roomType: 'clay',
        occupations: ['roughcaster-a110'],
        stone: 2, // clay→stone: 1 stone/room × 2 rooms
        reed: 1,
        food: 0,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Improvement step auto-skips (no resources left)

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
        occupations: ['roughcaster-a110'],
        food: 3, // from Roughcaster onRenovate (clay→stone)
      },
    })
  })

  test('onAnyRenovate hooks fire on all players cards (RecycledBrick gives clay)', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'clay',
        stone: 2,
        reed: 1,
      },
      micah: {
        food: 10,
        minorImprovements: ['recycled-brick-d077'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    // Improvement step auto-skips (no resources left)

    t.testBoard(game, {
      dennis: {
        roomType: 'stone',
      },
      micah: {
        food: 10,
        clay: 2, // RecycledBrick: 1 clay per room (2 rooms) on renovate to stone
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['recycled-brick-d077'],
      },
    })
  })

  test('onAnyRenovateToStone does not fire when renovating to clay', () => {
    const game = t.fixture({ cardSets: ['minorImprovementD', 'occupationA', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
      micah: {
        food: 10,
        minorImprovements: ['recycled-brick-d077'],
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
      },
    })
    game.run()

    // Wood→clay does NOT trigger RecycledBrick (only fires on renovate to stone)
    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
      },
      micah: {
        food: 10,
        clay: 0, // RecycledBrick only triggers on renovate to stone
        occupations: ['test-occupation-1', 'test-occupation-2', 'test-occupation-3'],
        minorImprovements: ['recycled-brick-d077'],
      },
    })
  })

  test('hasRenovated flag is set', () => {
    const game = t.fixture()
    t.setBoard(game, {
      actionSpaces: ['House Redevelopment'],
      dennis: {
        roomType: 'wood',
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    expect(game.players.byName('dennis').hasRenovated).toBeFalsy()

    t.choose(game, 'House Redevelopment')
    // Improvement step auto-skips (no resources left)

    expect(game.players.byName('dennis').hasRenovated).toBe(true)
  })
})
