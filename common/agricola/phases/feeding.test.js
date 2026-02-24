const t = require('../testutil.js')
const { InputRequestEvent } = require('../../lib/game.js')

describe('feeding', () => {
  test('getFoodRequired calculates correctly', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    // 2 family members * 2 food = 4
    expect(dennis.getFoodRequired()).toBe(4)
  })

  test('newborns only need 1 food', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.familyMembers = 3
    dennis.newborns = [3]

    // 2 adults * 2 + 1 newborn * 1 = 5
    expect(dennis.getFoodRequired()).toBe(5)
  })

  test('newborns persist through returnHomePhase to harvest', () => {
    const game = t.fixture({ seed: 'newborn-harvest-test' })
    game.run()

    const dennis = game.players.byName('dennis')
    // Setup: give player a room and grow family
    dennis.buildRoom(0, 2)
    dennis.growFamily()

    expect(dennis.familyMembers).toBe(3)
    expect(dennis.newborns).toContain(3)

    // Simulate returnHomePhase (what happens at end of work phase)
    game.returnHomePhase()

    // Newborns should still be tracked after returnHomePhase
    expect(dennis.newborns).toContain(3)
    expect(dennis.getFoodRequired()).toBe(5) // 2*2 + 1*1 = 5
  })

  test('newborns are cleared after round ends', () => {
    const game = t.fixture({ seed: 'newborn-clear-test' })
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.buildRoom(0, 2)
    dennis.growFamily()

    expect(dennis.newborns).toContain(3)

    // Clear newborns (happens at end of round)
    dennis.clearNewborns()

    expect(dennis.newborns).toEqual([])
    expect(dennis.getFoodRequired()).toBe(6) // 3*2 = 6 (all adults now)
  })

  test('feedFamily with enough food', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.setResource('food', 10)

    const result = dennis.feedFamily()

    expect(result.required).toBe(4)
    expect(result.beggingCards).toBe(0)
    expect(dennis.food).toBe(6)
  })

  test('feedFamily with insufficient food', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.setResource('food', 1)

    const result = dennis.feedFamily()

    expect(result.beggingCards).toBe(3) // Need 4, have 1
    expect(dennis.food).toBe(0)
    expect(dennis.beggingCards).toBe(3)
  })
})

describe('anytime food conversion', () => {

  function respondAnytimeAction(game, anytimeAction) {
    const request = game.waiting
    const selector = request.selectors[0]
    return game.respondToInputRequest({
      actor: selector.actor,
      title: selector.title,
      selection: { action: 'anytime-action', anytimeAction },
    })
  }

  test('getAnytimeFoodConversionOptions returns basic options for grain and vegetables', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { grain: 2, vegetables: 1 },
    })
    game.run()

    const dennis = t.player(game)
    const options = game.getAnytimeFoodConversionOptions(dennis)

    expect(options).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'basic', resource: 'grain', food: 1 }),
      expect.objectContaining({ type: 'basic', resource: 'vegetables', food: 1 }),
    ]))
  })

  test('getAnytimeFoodConversionOptions returns cooking options with Fireplace', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    const options = game.getAnytimeFoodConversionOptions(dennis)

    expect(options).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'cook', resource: 'sheep', food: 2 }),
    ]))
  })

  test('getAnytimeFoodConversionOptions returns empty when no convertible resources', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { food: 5 },
    })
    game.run()

    const dennis = t.player(game)
    const options = game.getAnytimeFoodConversionOptions(dennis)
    expect(options).toEqual([])
  })

  test('executeAnytimeFoodConversion converts grain to food', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { grain: 3, food: 0 },
    })
    game.run()

    const dennis = t.player(game)
    game.executeAnytimeFoodConversion(dennis, {
      type: 'basic', resource: 'grain', count: 1, food: 1,
    })
    expect(dennis.grain).toBe(2)
    expect(dennis.food).toBe(1)
  })

  test('executeAnytimeFoodConversion cooks animal', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    game.executeAnytimeFoodConversion(dennis, {
      type: 'cook', resource: 'sheep', count: 1, food: 2,
    })
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
    expect(dennis.food).toBe(2)
  })

  test('executeAnytimeFoodConversion handles craft type', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['joinery'],
        wood: 3,
        food: 0,
      },
    })
    game.run()

    const dennis = t.player(game)
    game.executeAnytimeFoodConversion(dennis, {
      type: 'craft', improvement: 'Joinery', resource: 'wood', count: 1, food: 2,
    })
    expect(dennis.wood).toBe(2)
    expect(dennis.food).toBe(2)
  })

  test('allowFoodConversion uses shared conversion method', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 3 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)

    // Mock choose to select cooking sheep
    game.actions.choose = () => ['Cook 1 sheep for 2 food']

    // Call allowFoodConversion (used during harvest)
    game.allowFoodConversion(dennis, 4)

    // Should have cooked 2 sheep (4 food needed, 2 food per sheep)
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
    expect(dennis.food).toBe(4)
  })

  test('choose override intercepts anytime-action and re-presents choices', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    // First request: action space selection with anytime actions
    const request = game.waiting
    expect(request.selectors[0].anytimeActions).toBeDefined()
    expect(request.selectors[0].anytimeActions.length).toBeGreaterThan(0)

    // Send anytime-action to cook a sheep
    respondAnytimeAction(game, {
      type: 'cook', resource: 'sheep', count: 1, food: 2,
    })

    // Should re-present the same selector (action space choice)
    const dennis = t.player(game)
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
    expect(dennis.food).toBe(2)

    // Game should still be waiting for action selection
    const request2 = game.waiting
    expect(request2).toBeInstanceOf(InputRequestEvent)
  })

  test('anytimeActions not present when no cooking ability', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { food: 5 },
    })
    game.run()

    const request = game.waiting
    expect(request.selectors[0].anytimeActions).toBeUndefined()
  })

  test('player with Fireplace + animals can cook during occupation flow', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        food: 0,
        majorImprovements: ['fireplace-2'],
        occupations: ['homekeeper-a085'],
        hand: ['knapper-a124'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    // Choose the Lessons action space
    t.choose(game, 'Lessons A')

    // Should be at occupation selection (not blocked by food gate)
    const request = game.waiting
    expect(request.selectors[0].title).toMatch(/Occupation/)
    expect(request.selectors[0].anytimeActions).toBeDefined()

    // Cook a sheep via anytime action
    respondAnytimeAction(game, {
      type: 'cook', resource: 'sheep', count: 1, food: 2,
    })

    const dennis = t.player(game)
    expect(dennis.food).toBe(2)
    expect(dennis.getTotalAnimals('sheep')).toBe(1)

    // Now select the occupation
    t.choose(game, 'Knapper')

    // Re-fetch dennis after full replay
    const d = t.player(game)

    // Occupation was played, food deducted
    expect(d.playedOccupations).toContain('knapper-a124')
    expect(d.food).toBe(1)   // 0 + 2 cooked - 1 occupation cost
  })
})

describe('anytime actions system', () => {

  test('getAnytimeActions returns cooking options with Fireplace and animals', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    const actions = game.getAnytimeActions(dennis)

    expect(actions).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'cook', resource: 'sheep', food: 2 }),
    ]))
  })

  test('getAnytimeActions does NOT return basic 1:1 grain/vegetable conversions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { grain: 3, vegetables: 2 },
    })
    game.run()

    const dennis = t.player(game)
    const actions = game.getAnytimeActions(dennis)

    // Basic conversions are feeding-only, not anytime
    expect(actions).toEqual([])
  })

  test('getAnytimeActions returns empty when no cooking ability and no cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { food: 5, wood: 3 },
    })
    game.run()

    const dennis = t.player(game)
    const actions = game.getAnytimeActions(dennis)
    expect(actions).toEqual([])
  })

  test('noAutoRespond set on selector when anytime actions exist', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    const request = game.waiting
    expect(request.selectors[0].noAutoRespond).toBe(true)
    expect(request.selectors[0].anytimeActions).toBeDefined()
  })

  test('noAutoRespond not set when no anytime actions', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { food: 5 },
    })
    game.run()

    const request = game.waiting
    expect(request.selectors[0].noAutoRespond).toBeUndefined()
    expect(request.selectors[0].anytimeActions).toBeUndefined()
  })

  test('executeAnytimeAction delegates to executeAnytimeFoodConversion', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 2 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    game.executeAnytimeAction(dennis, {
      type: 'cook', resource: 'sheep', count: 1, food: 2,
    })
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
    expect(dennis.food).toBe(2)
  })
})

describe('v6 continued food conversion after enough food', () => {

  test('v6: player with enough food and cooking improvement can still convert', () => {
    const game = t.fixture({ version: 6 })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 3 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)
    let callCount = 0

    // Mock choose: first call converts a sheep, second call feeds family
    game.actions.choose = () => {
      callCount++
      if (callCount === 1) {
        return ['Cook 1 sheep for 2 food']
      }
      return ['Feed family']
    }

    game.allowFoodConversion(dennis, 4)

    // Should have cooked 1 sheep even though already had enough food
    expect(dennis.getTotalAnimals('sheep')).toBe(2)
    expect(dennis.food).toBe(12)
  })

  test('v6: player with enough food and craft improvement (Joinery) can convert', () => {
    const game = t.fixture({ version: 6 })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['joinery'],
        food: 10,
        wood: 3,
      },
    })
    game.run()

    const dennis = t.player(game)
    let callCount = 0

    game.actions.choose = () => {
      callCount++
      if (callCount === 1) {
        return ['Use Joinery: convert wood to 2 food']
      }
      return ['Feed family']
    }

    game.allowFoodConversion(dennis, 4)

    expect(dennis.wood).toBe(2)
    expect(dennis.food).toBe(12)
  })

  test('v6: player with enough food and basic grain can convert to stockpile', () => {
    const game = t.fixture({ version: 6 })
    t.setBoard(game, {
      dennis: {
        food: 10,
        grain: 2,
      },
    })
    game.run()

    const dennis = t.player(game)
    let callCount = 0

    game.actions.choose = () => {
      callCount++
      if (callCount === 1) {
        return ['Convert 1 grain to 1 food']
      }
      return ['Feed family']
    }

    game.allowFoodConversion(dennis, 4)

    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(11)
  })

  test('v6: selecting Feed family immediately exits without extra conversions', () => {
    const game = t.fixture({ version: 6 })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 3 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)

    // Immediately select Feed family
    game.actions.choose = () => ['Feed family']

    game.allowFoodConversion(dennis, 4)

    // No conversions should have happened
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(dennis.food).toBe(10)
  })

  test('v5: auto-advances when player has enough food (old behavior)', () => {
    const game = t.fixture({ version: 5 })
    t.setBoard(game, {
      dennis: {
        majorImprovements: ['fireplace-2'],
        food: 10,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 0 }], animals: { sheep: 3 } }],
        },
      },
    })
    game.run()

    const dennis = t.player(game)

    // choose should never be called since food >= required
    game.actions.choose = () => {
      throw new Error('choose should not be called in v5 when food >= required')
    }

    game.allowFoodConversion(dennis, 4)

    // No conversions, auto-advanced
    expect(dennis.getTotalAnimals('sheep')).toBe(3)
    expect(dennis.food).toBe(10)
  })
})
