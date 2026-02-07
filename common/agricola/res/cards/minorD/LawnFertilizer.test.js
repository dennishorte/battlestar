const res = require('../../index.js')

describe('Lawn Fertilizer (D011)', () => {
  test('modifies pasture capacity for size 1 pastures', () => {
    const card = res.getCardById('lawn-fertilizer-d011')

    // Size 1 pasture without stable
    let capacity = card.modifyPastureCapacity(null, null, 2, 1, false)
    expect(capacity).toBe(3)

    // Size 1 pasture with stable
    capacity = card.modifyPastureCapacity(null, null, 2, 1, true)
    expect(capacity).toBe(6)

    // Size 2 pasture - should not modify
    capacity = card.modifyPastureCapacity(null, null, 4, 2, false)
    expect(capacity).toBe(4)
  })
})
