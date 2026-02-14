const t = require('../../../testutil_v2.js')


describe('Seed Trader', () => {
  test('onPlay places 2 grain and 2 vegetables on card', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['seed-trader-d114'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Seed Trader')

    const state = game.cardState('seed-trader-d114')
    expect(state.grain).toBe(2)
    expect(state.vegetables).toBe(2)
  })

  test('buy grain for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['seed-trader-d114'],
        food: 10,
      },
      micah: { food: 10 },
    })
    // Initialize card state via breakpoint (setBoard doesn't call onPlay)
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('seed-trader-d114').grain = 2
      game.cardState('seed-trader-d114').vegetables = 2
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const buyGrain = actions.find(a => a.cardName === 'Seed Trader' && a.actionKey === 'buyGrain')
    expect(buyGrain).toBeDefined()

    t.anytimeAction(game, buyGrain)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 10, // 10 - 2(buy) + 2(DL)
        grain: 2, // 1(bought) + 1(Grain Seeds)
        occupations: ['seed-trader-d114'],
      },
    })

    // Card state should reflect purchase
    expect(game.cardState('seed-trader-d114').grain).toBe(1)
  })

  test('buy vegetable for 3 food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['seed-trader-d114'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('seed-trader-d114').grain = 2
      game.cardState('seed-trader-d114').vegetables = 2
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const buyVeg = actions.find(a => a.cardName === 'Seed Trader' && a.actionKey === 'buyVegetable')
    expect(buyVeg).toBeDefined()

    t.anytimeAction(game, buyVeg)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 9, // 10 - 3(buy) + 2(DL)
        grain: 1,
        vegetables: 1,
        occupations: ['seed-trader-d114'],
      },
    })

    expect(game.cardState('seed-trader-d114').vegetables).toBe(1)
  })

  test('not available when stock depleted', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['seed-trader-d114'],
        food: 10,
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.cardState('seed-trader-d114').grain = 0
      game.cardState('seed-trader-d114').vegetables = 0
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Seed Trader')).toBe(false)
  })
})
