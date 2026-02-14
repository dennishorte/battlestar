const t = require('../../../testutil_v2.js')


describe('Clay Firer', () => {
  test('onPlay gives 2 clay', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        hand: ['clay-firer-d162'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Clay Firer')

    t.testBoard(game, {
      dennis: {
        clay: 2,
        occupations: ['clay-firer-d162'],
      },
    })
  })

  test('exchange 2 clay → 1 stone', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['clay-firer-d162'],
        clay: 3,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const exchange2 = actions.find(a => a.cardName === 'Clay Firer' && a.from?.clay === 2)
    expect(exchange2).toBeDefined()

    t.anytimeAction(game, exchange2)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1, // 3 - 2
        stone: 1,
        food: 12, // 10 + 2 DL
        grain: 1,
        occupations: ['clay-firer-d162'],
      },
    })
  })

  test('exchange 3 clay → 2 stone', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['clay-firer-d162'],
        clay: 4,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    const exchange3 = actions.find(a => a.cardName === 'Clay Firer' && a.from?.clay === 3)
    expect(exchange3).toBeDefined()

    t.anytimeAction(game, exchange3)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        clay: 1, // 4 - 3
        stone: 2,
        food: 12,
        grain: 1,
        occupations: ['clay-firer-d162'],
      },
    })
  })

  test('not available with insufficient clay', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['clay-firer-d162'],
        clay: 1,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Clay Firer')).toBe(false)
  })
})
