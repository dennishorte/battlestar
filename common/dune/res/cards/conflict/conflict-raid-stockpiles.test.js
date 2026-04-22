const card = require('./conflict-raid-stockpiles.js')

describe('conflict-raid-stockpiles', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-raid-stockpiles')
    expect(card.name).toBe('Raid Stockpiles')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
