const t = require('../../../testutil_v2.js')


describe('Hard Porcelain', () => {
  test('exchange 2 clay → 1 stone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['hard-porcelain-b080'],
        clay: 3,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const tier1 = actions.find(a => a.cardName === 'Hard Porcelain' && a.from?.clay === 2)
    expect(tier1).toBeDefined()

    t.anytimeAction(game, tier1)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1, // 3 - 2
        stone: 1,
        food: 12,
        grain: 1,
        minorImprovements: ['hard-porcelain-b080'],
      },
    })
  })

  test('exchange 4 clay → 3 stone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['hard-porcelain-b080'],
        clay: 5,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const tier3 = actions.find(a => a.cardName === 'Hard Porcelain' && a.from?.clay === 4)
    expect(tier3).toBeDefined()

    t.anytimeAction(game, tier3)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1, // 5 - 4
        stone: 3,
        food: 12,
        grain: 1,
        minorImprovements: ['hard-porcelain-b080'],
      },
    })
  })

  test('shows only affordable tiers', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['hard-porcelain-b080'],
        clay: 2,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const porcelainActions = actions.filter(a => a.cardName === 'Hard Porcelain')
    expect(porcelainActions.length).toBe(1) // only tier 1 (2 clay)
    expect(porcelainActions[0].from.clay).toBe(2)
  })
})
