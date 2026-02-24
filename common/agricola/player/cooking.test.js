const t = require('../testutil.js')

describe('cooking and baking', () => {
  test('hasCookingAbility without improvement', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.hasCookingAbility()).toBe(false)
  })

  test('hasCookingAbility with fireplace', () => {
    const game = t.gameFixture({
      dennis: { majorImprovements: ['fireplace-2'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.hasCookingAbility()).toBe(true)
  })

  test('cookAnimal converts to food', () => {
    const game = t.gameFixture({
      dennis: { majorImprovements: ['fireplace-2'] },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    t.addPasture(dennis, [{ row: 1, col: 0 }], 'sheep', 2)

    const food = dennis.cookAnimal('sheep', 1)

    expect(food).toBe(2) // Fireplace: sheep -> 2 food
    expect(dennis.food).toBe(4) // Started with 2
    expect(dennis.getTotalAnimals('sheep')).toBe(1)
  })

  test('bakeGrain with fireplace', () => {
    const game = t.gameFixture({
      dennis: { majorImprovements: ['fireplace-2'], grain: 3 },
    })
    game.run()

    const dennis = game.players.byName('dennis')
    const food = dennis.bakeGrain(2)

    expect(food).toBe(4) // Fireplace: 2 grain -> 4 food
    expect(dennis.grain).toBe(1)
  })

  test('convertToFood basic conversion', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.setResource('grain', 3)

    const converted = dennis.convertToFood('grain', 2)

    expect(converted).toBe(2)
    expect(dennis.grain).toBe(1)
    expect(dennis.food).toBe(4) // Started with 2
  })
})
