const res = require('../../index.js')

describe('Half-Timbered House (C030)', () => {
  test('gives points for stone rooms', () => {
    const card = res.getCardById('half-timbered-house-c030')
    const mockPlayer = {
      roomType: 'stone',
      getRoomCount: () => 4,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives no points for non-stone rooms', () => {
    const card = res.getCardById('half-timbered-house-c030')
    const mockPlayer = {
      roomType: 'clay',
      getRoomCount: () => 4,
    }
    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
