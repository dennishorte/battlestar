const res = require('../../index.js')

describe('Muck Rake (D029)', () => {
  test('gives 1 point for exactly 1 unfenced stable with 1 sheep', () => {
    const card = res.getCardById('muck-rake-d029')
    const player = {
      getUnfencedStablesWithAnimals: () => [
        { animalType: 'sheep', animalCount: 1 },
      ],
    }

    expect(card.getEndGamePoints(player)).toBe(1)
  })

  test('gives 3 points for 1 sheep, 1 boar, and 1 cattle in separate stables', () => {
    const card = res.getCardById('muck-rake-d029')
    const player = {
      getUnfencedStablesWithAnimals: () => [
        { animalType: 'sheep', animalCount: 1 },
        { animalType: 'boar', animalCount: 1 },
        { animalType: 'cattle', animalCount: 1 },
      ],
    }

    expect(card.getEndGamePoints(player)).toBe(3)
  })

  test('gives 0 points when stable has more than 1 animal', () => {
    const card = res.getCardById('muck-rake-d029')
    const player = {
      getUnfencedStablesWithAnimals: () => [
        { animalType: 'sheep', animalCount: 2 },
      ],
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points when multiple stables have same animal type with 1 each', () => {
    const card = res.getCardById('muck-rake-d029')
    const player = {
      getUnfencedStablesWithAnimals: () => [
        { animalType: 'sheep', animalCount: 1 },
        { animalType: 'sheep', animalCount: 1 },
      ],
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('gives 0 points for no unfenced stables', () => {
    const card = res.getCardById('muck-rake-d029')
    const player = {
      getUnfencedStablesWithAnimals: () => [],
    }

    expect(card.getEndGamePoints(player)).toBe(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('muck-rake-d029')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
