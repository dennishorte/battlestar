const res = require('../../index.js')

describe('Summer House (D033)', () => {
  test('gives 2 points per unused space adjacent to house when in stone house', () => {
    const card = res.getCardById('summer-house-d033')
    const player = {
      roomType: 'stone',
      getUnusedSpacesAdjacentToHouse: () => 3,
    }

    expect(card.getEndGamePoints(player)).toBe(6)
  })

  test('gives 0 points when not in stone house', () => {
    const card = res.getCardById('summer-house-d033')
    const player = {
      roomType: 'clay',
      getUnusedSpacesAdjacentToHouse: () => 3,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points when no unused spaces adjacent to house', () => {
    const card = res.getCardById('summer-house-d033')
    const player = {
      roomType: 'stone',
      getUnusedSpacesAdjacentToHouse: () => 0,
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('summer-house-d033')
    expect(card.cost).toEqual({ wood: 3, stone: 1 })
    expect(card.prereqs).toEqual({ houseType: 'wood' })
  })
})
