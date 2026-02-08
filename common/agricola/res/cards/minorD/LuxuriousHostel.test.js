const res = require('../../index.js')

describe('Luxurious Hostel (D034)', () => {
  test('gives 4 points when stone rooms exceed family members', () => {
    const card = res.getCardById('luxurious-hostel-d034')
    const player = {
      roomType: 'stone',
      familyMembers: 3,
      getRoomCount: () => 5,
    }

    expect(card.getEndGamePoints(player)).toBe(4)
  })

  test('gives 0 points when stone rooms equal family members', () => {
    const card = res.getCardById('luxurious-hostel-d034')
    const player = {
      roomType: 'stone',
      familyMembers: 4,
      getRoomCount: () => 4,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points when stone rooms are fewer than family members', () => {
    const card = res.getCardById('luxurious-hostel-d034')
    const player = {
      roomType: 'stone',
      familyMembers: 5,
      getRoomCount: () => 3,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points for non-stone house', () => {
    const card = res.getCardById('luxurious-hostel-d034')
    const player = {
      roomType: 'clay',
      familyMembers: 3,
      getRoomCount: () => 5,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('luxurious-hostel-d034')
    expect(card.cost).toEqual({ wood: 1, clay: 2 })
  })
})
