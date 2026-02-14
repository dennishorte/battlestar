const t = require('../../../testutil_v2.js')


describe('Clay Carrier', () => {
  test('onPlay gives 2 clay', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['clay-carrier-d122'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Carrier')

    t.testBoard(game, {
      dennis: {
        clay: 2,
        occupations: ['clay-carrier-d122'],
      },
    })
  })

  test('buy 2 clay for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['clay-carrier-d122'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const buyAction = actions.find(a => a.cardName === 'Clay Carrier')
    expect(buyAction).toBeDefined()
    expect(buyAction.oncePerRound).toBe(true)

    t.anytimeAction(game, buyAction)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 10, // 10 - 2(buy) + 2(DL)
        clay: 2,
        grain: 1,
        occupations: ['clay-carrier-d122'],
      },
    })
  })

  test('once per round — not available after use', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['clay-carrier-d122'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const buyAction = actions.find(a => a.cardName === 'Clay Carrier')
    t.anytimeAction(game, buyAction)

    const dennis2 = game.players.byName('dennis')
    const actions2 = game.getAnytimeActions(dennis2)
    expect(actions2.some(a => a.cardName === 'Clay Carrier')).toBe(false)
  })

  test('not available when food < 2', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['clay-carrier-d122'],
        food: 1,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Clay Carrier')).toBe(false)
  })
})
