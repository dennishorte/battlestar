const t = require('../../../testutil_v2.js')

describe('Den Builder', () => {
  // Card text: "When you live in a clay or stone house, you can pay 1 grain
  // and 2 food. If you do, for the rest of the game, this card provides room
  // for exactly one person."

  test('activates room for 1 grain and 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['den-builder-c085'],
        roomType: 'clay',
        grain: 1,
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')

    // Before activation: 2 rooms, 2 family = no spare room
    expect(dennis.getRoomCount()).toBe(2)

    const actions = game.getAnytimeActions(dennis)
    const activateAction = actions.find(a => a.cardName === 'Den Builder')
    expect(activateAction).toBeDefined()

    t.anytimeAction(game, activateAction)

    // After activation: 2 rooms + 1 den = 3 capacity
    expect(dennis.getRoomCount()).toBe(3)
    expect(game.cardState('den-builder-c085').providesRoom).toBe(true)

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        occupations: ['den-builder-c085'],
        roomType: 'clay',
        grain: 1,   // 1 - 1(activation) + 1(Grain Seeds)
        food: 10,   // 10 - 2(activation) + 2(DL)
      },
    })
  })

  test('not available with wood rooms', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['den-builder-c085'],
        roomType: 'wood',
        grain: 1,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Den Builder')).toBe(false)
  })

  test('not available after already activated', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Day Laborer', 'Forest', 'Grain Seeds', 'Clay Pit'],
      dennis: {
        occupations: ['den-builder-c085'],
        roomType: 'clay',
        grain: 2,
        food: 5,
      },
      micah: { food: 10 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const action = game.getAnytimeActions(dennis).find(a => a.cardName === 'Den Builder')
    t.anytimeAction(game, action)

    // Should no longer be available
    const actions2 = game.getAnytimeActions(dennis)
    expect(actions2.some(a => a.cardName === 'Den Builder')).toBe(false)
  })

  test('not available when cannot afford', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      dennis: {
        occupations: ['den-builder-c085'],
        roomType: 'clay',
        grain: 0,
        food: 5,
      },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const actions = game.getAnytimeActions(dennis)
    expect(actions.some(a => a.cardName === 'Den Builder')).toBe(false)
  })
})
