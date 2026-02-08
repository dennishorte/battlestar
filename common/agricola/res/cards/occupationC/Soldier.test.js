const res = require('../../index.js')

describe('Soldier (C133)', () => {
  test('uses stone and wood for scoring', () => {
    const card = res.getCardById('soldier-c133')

    expect(card.resourcesUsedForScoring).toEqual(['stone', 'wood'])
  })

  test('gives points equal to minimum of stone and wood', () => {
    const card = res.getCardById('soldier-c133')

    const mockPlayer = {
      stone: 5,
      wood: 3,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(3)
  })

  test('gives points when stone is limiting factor', () => {
    const card = res.getCardById('soldier-c133')

    const mockPlayer = {
      stone: 2,
      wood: 6,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(2)
  })

  test('gives 0 points when either resource is 0', () => {
    const card = res.getCardById('soldier-c133')

    const mockPlayer = {
      stone: 0,
      wood: 5,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
