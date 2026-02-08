const res = require('../../index.js')

describe('Petting Zoo (E011)', () => {
  test('holds mixed animals', () => {
    const card = res.getCardById('petting-zoo-e011')
    expect(card.holdsAnimals).toBe(true)
    expect(card.mixedAnimals).toBe(true)
  })

  test('capacity equals room count when pasture is adjacent to house', () => {
    const card = res.getCardById('petting-zoo-e011')

    const player = {
      hasPastureAdjacentToHouse: () => true,
      getRoomCount: () => 4,
    }

    const capacity = card.getAnimalCapacity(player)

    expect(capacity).toBe(4)
  })

  test('capacity is 0 when no pasture adjacent to house', () => {
    const card = res.getCardById('petting-zoo-e011')

    const player = {
      hasPastureAdjacentToHouse: () => false,
      getRoomCount: () => 4,
    }

    const capacity = card.getAnimalCapacity(player)

    expect(capacity).toBe(0)
  })
})
