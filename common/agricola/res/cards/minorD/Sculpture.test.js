const res = require('../../index.js')

describe('Sculpture (D037)', () => {
  test('has correct properties', () => {
    const card = res.getCardById('sculpture-d037')
    expect(card.cost).toEqual({ stone: 1 })
    expect(card.vps).toBe(2)
    expect(card.prereqs).toEqual({ roundsLeftGreaterThanUnusedSpaces: true })
  })
})
