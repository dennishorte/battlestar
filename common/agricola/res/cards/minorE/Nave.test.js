const res = require('../../index.js')

describe('Nave (E032)', () => {
  test('gives bonus points based on columns with rooms', () => {
    const card = res.getCardById('nave-e032')

    const player = {
      getColumnsWithRooms: () => 3,
    }

    const points = card.getEndGamePoints(player)

    expect(points).toBe(3)
  })

  test('gives 5 points if all columns have rooms', () => {
    const card = res.getCardById('nave-e032')

    const player = {
      getColumnsWithRooms: () => 5,
    }

    const points = card.getEndGamePoints(player)

    expect(points).toBe(5)
  })

  test('gives 0 points if no columns have rooms', () => {
    const card = res.getCardById('nave-e032')

    const player = {
      getColumnsWithRooms: () => 0,
    }

    const points = card.getEndGamePoints(player)

    expect(points).toBe(0)
  })
})
