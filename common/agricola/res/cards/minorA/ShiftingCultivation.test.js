const res = require('../../index.js')

describe('Shifting Cultivation (A002)', () => {
  test('plows a field on play', () => {
    const card = res.getCardById('shifting-cultivation-a002')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({ food: 2 })
    expect(card.text).toContain('plow 1 field')
  })
})
