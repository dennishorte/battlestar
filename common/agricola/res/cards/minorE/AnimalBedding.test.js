const res = require('../../index.js')

describe('Animal Bedding (E012)', () => {
  test('adds 1 capacity to unfenced stable', () => {
    const card = res.getCardById('animal-bedding-e012')

    const result = card.modifyStableCapacity(null, null, 1, false)

    expect(result).toBe(2)
  })

  test('adds 2 capacity to stable in pasture', () => {
    const card = res.getCardById('animal-bedding-e012')

    const result = card.modifyStableCapacity(null, null, 4, true)

    expect(result).toBe(6)
  })
})
