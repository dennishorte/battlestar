const res = require('../../index.js')

describe('Bunk Beds (C010)', () => {
  test('modifies house capacity when 4+ rooms', () => {
    const card = res.getCardById('bunk-beds-c010')
    const mockPlayer = { getRoomCount: () => 4 }
    const capacity = card.modifyHouseCapacity(mockPlayer, 4)
    expect(capacity).toBe(5)
  })

  test('does not modify capacity with fewer than 4 rooms', () => {
    const card = res.getCardById('bunk-beds-c010')
    const mockPlayer = { getRoomCount: () => 3 }
    const capacity = card.modifyHouseCapacity(mockPlayer, 3)
    expect(capacity).toBe(3)
  })
})
