const t = require('../../../testutil_v2.js')

describe('MaterialHub', () => {
  test('gives 1 wood from card when 5+ wood taken', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['material-hub-c081'],
        reed: 1,
        stone: 1,
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
      game.state.actionSpaces['take-wood'].accumulated = 2
    })
    game.run()

    // Dennis takes Forest: 2+3 = 5 wood, meets threshold
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 6, // 5 from Forest + 1 from MaterialHub
        reed: 1,
        stone: 1,
        minorImprovements: ['material-hub-c081'],
      },
    })

    const player = game.players.byName('dennis')
    expect(player.materialHubResources.wood).toBe(1)
  })

  test('no bonus when below threshold', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['material-hub-c081'],
        reed: 1,
        stone: 1,
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
      game.state.actionSpaces['take-wood'].accumulated = 1
    })
    game.run()

    // Dennis takes Forest: 1+3 = 4 wood, below threshold
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 4,
        reed: 1,
        stone: 1,
        minorImprovements: ['material-hub-c081'],
      },
    })

    const player = game.players.byName('dennis')
    expect(player.materialHubResources.wood).toBe(2)
  })

  test('triggers when other player takes resources', () => {
    const game = t.fixture({ cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        minorImprovements: ['material-hub-c081'],
        reed: 1,
        stone: 1,
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const player = game.players.byName('dennis')
      player.materialHubResources = { wood: 2, clay: 2, reed: 2, stone: 2 }
      game.state.actionSpaces['take-wood'].accumulated = 2
    })
    game.run()

    // Micah takes Forest: 5 wood >= 5 threshold → MaterialHub gives dennis 1 wood
    t.choose(game, 'Forest')

    const dennis = game.players.byName('dennis')
    expect(dennis.wood).toBe(1) // 1 wood from MaterialHub (didn't take wood himself)
    expect(dennis.materialHubResources.wood).toBe(1)
  })
})
