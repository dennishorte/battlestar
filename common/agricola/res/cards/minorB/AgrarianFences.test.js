const res = require('../../index.js')

describe('Agrarian Fences (B026)', () => {
  test('has modifyGrainUtilization flag', () => {
    const card = res.getCardById('agrarian-fences-b026')
    expect(card.modifyGrainUtilization).toBe(true)
  })

  test('has no cost', () => {
    const card = res.getCardById('agrarian-fences-b026')
    expect(card.cost).toEqual({})
  })
})
