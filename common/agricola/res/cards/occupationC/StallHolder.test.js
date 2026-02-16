const t = require('../../../testutil_v2.js')

describe('Stall Holder', () => {
  // Card text: "Once per round, if you have 0/1/2/3/4 unfenced stables on your
  // farm, you can exchange 2 grain for 1 bonus point and 1/2/3/4/5 food."

  test('exchanges 2 grain for 1 BP and 1 food with 0 unfenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 2,
        food: 0,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const action = actions.find(a => a.cardName === 'Stall Holder')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 1,  // 2 - 2 + 1(Grain Seeds)
        food: 3,   // 0 + 1(exchange) + 2(DL)
        bonusPoints: 1,
      },
    })
  })

  test('gives more food with unfenced stables', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 2,
        food: 0,
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Stall Holder')
    expect(action).toBeDefined()

    t.anytimeAction(game, action)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 1,  // 2 - 2 + 1(Grain Seeds)
        food: 5,   // 0 + 3(exchange: 2 unfenced stables) + 2(DL)
        bonusPoints: 1,
        farmyard: {
          stables: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })

  test('once per round — not available after use', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 4,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Stall Holder')
    t.anytimeAction(game, action)

    const actions2 = game.getAnytimeActions(dennis)
    expect(actions2.some(a => a.cardName === 'Stall Holder')).toBe(false)
  })

  test('not available when grain < 2', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['stall-holder-c101'],
        grain: 1,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Stall Holder')).toBe(false)
  })
})
