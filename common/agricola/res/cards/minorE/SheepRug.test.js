const res = require('../../index.js')

describe('Sheep Rug (E021)', () => {
  test('ignores occupancy for family growth actions', () => {
    const card = res.getCardById('sheep-rug-e021')
    expect(card.ignoresOccupancyFor).toContain('family-growth')
    expect(card.ignoresOccupancyFor).toContain('family-growth-urgent')
  })

  test('has 1 vps', () => {
    const card = res.getCardById('sheep-rug-e021')
    expect(card.vps).toBe(1)
  })

  test('requires 4 sheep as prereq', () => {
    const card = res.getCardById('sheep-rug-e021')
    expect(card.prereqs.sheep).toBe(4)
  })

  test('costs 1 sheep', () => {
    const card = res.getCardById('sheep-rug-e021')
    expect(card.cost.sheep).toBe(1)
  })
})
