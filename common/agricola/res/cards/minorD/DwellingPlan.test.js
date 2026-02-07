const res = require('../../index.js')

describe('Dwelling Plan (D002)', () => {
  test('has onPlay hook', () => {
    const card = res.getCardById('dwelling-plan-d002')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({ food: 1 })
  })
})
