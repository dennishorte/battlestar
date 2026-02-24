const t = require('../testutil.js')

describe('fields', () => {
  test('plowField creates field', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.plowField(0, 1)).toBe(true)

    expect(dennis.getSpace(0, 1).type).toBe('field')
    expect(dennis.getFieldCount()).toBe(1)
  })

  test('first field can go anywhere', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    expect(dennis.canPlowField(2, 4)).toBe(true)
  })

  test('additional fields must be adjacent', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.plowField(0, 1)

    expect(dennis.canPlowField(0, 2)).toBe(true)  // Adjacent
    expect(dennis.canPlowField(2, 4)).toBe(false) // Not adjacent
  })

  test('sowField plants crops', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    dennis.plowField(0, 1)
    dennis.setResource('grain', 1)

    expect(dennis.sowField(0, 1, 'grain')).toBe(true)

    const space = dennis.getSpace(0, 1)
    expect(space.crop).toBe('grain')
    expect(space.cropCount).toBe(3) // 1 + 2 bonus
    expect(dennis.grain).toBe(0)
  })

  test('harvestFields collects crops', () => {
    const game = t.fixture()
    game.run()

    const dennis = game.players.byName('dennis')
    t.plowFields(dennis, [{ row: 0, col: 1 }])
    t.sowFields(dennis, [{ row: 0, col: 1, crop: 'grain', cropCount: 3 }])

    const result = dennis.harvestFields()

    expect(result.harvested.grain).toBe(1)
    expect(dennis.grain).toBe(1)
    expect(dennis.getSpace(0, 1).cropCount).toBe(2)
  })
})
