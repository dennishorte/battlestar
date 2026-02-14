const t = require('../../../testutil_v2.js')


describe('Kettle', () => {
  test('exchange 1 grain → 3 food (no bonus)', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['kettle-b032'],
        grain: 2,
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const tier1 = actions.find(a => a.cardName === 'Kettle' && a.from?.grain === 1)
    expect(tier1).toBeDefined()
    expect(tier1.bonusPoints).toBeUndefined()

    t.anytimeAction(game, tier1)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        grain: 2, // 2 - 1 + 1(Grain Seeds)
        food: 15, // 10 + 3(kettle) + 2(DL)
        minorImprovements: ['kettle-b032'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('exchange 3 grain → 4 food + 1 bonus point', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['kettle-b032'],
        grain: 3,
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const tier2 = actions.find(a => a.cardName === 'Kettle' && a.from?.grain === 3)
    expect(tier2).toBeDefined()
    expect(tier2.bonusPoints).toBe(1)

    t.anytimeAction(game, tier2)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 3 - 3 + 1(Grain Seeds)
        food: 16, // 10 + 4(kettle) + 2(DL)
        bonusPoints: 1,
        minorImprovements: ['kettle-b032'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })

  test('exchange 5 grain → 5 food + 2 bonus points', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        minorImprovements: ['kettle-b032'],
        grain: 5,
        food: 10,
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const tier3 = actions.find(a => a.cardName === 'Kettle' && a.from?.grain === 5)
    expect(tier3).toBeDefined()
    expect(tier3.bonusPoints).toBe(2)

    t.anytimeAction(game, tier3)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        grain: 1, // 5 - 5 + 1(Grain Seeds)
        food: 17, // 10 + 5(kettle) + 2(DL)
        bonusPoints: 2,
        minorImprovements: ['kettle-b032'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 1 }],
        },
      },
    })
  })
})
