const res = require('../../index.js')

describe('Stable (C002)', () => {
  test('has onPlay that builds free stable', () => {
    const card = res.getCardById('stable-c002')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({ wood: 1 })
  })
})
