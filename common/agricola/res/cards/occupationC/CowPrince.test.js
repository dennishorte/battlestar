const res = require('../../index.js')

describe('Cow Prince (C134)', () => {
  test('gives bonus points equal to spaces with cattle', () => {
    const card = res.getCardById('cow-prince-c134')

    const mockPlayer = {
      getSpacesWithCattle: () => 4,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(4)
  })

  test('gives 0 points when no spaces have cattle', () => {
    const card = res.getCardById('cow-prince-c134')

    const mockPlayer = {
      getSpacesWithCattle: () => 0,
    }

    expect(card.getEndGamePoints(mockPlayer)).toBe(0)
  })
})
