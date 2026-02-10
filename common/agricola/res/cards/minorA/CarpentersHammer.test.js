const res = require('../../index.js')

describe("Carpenter's Hammer", () => {
  test('discounts 2 reed and 2 wood for wood rooms', () => {
    const card = res.getCardById('carpenters-hammer-a014')
    const cost = { wood: 10, reed: 4 }
    const result = card.modifyMultiRoomCost(null, cost, 2, 'wood')
    expect(result).toEqual({ wood: 8, reed: 2 })
  })

  test('discounts 2 reed and 3 clay for clay rooms', () => {
    const card = res.getCardById('carpenters-hammer-a014')
    const cost = { clay: 9, reed: 4 }
    const result = card.modifyMultiRoomCost(null, cost, 2, 'clay')
    expect(result).toEqual({ clay: 6, reed: 2 })
  })

  test('discounts 2 reed and 4 stone for stone rooms', () => {
    const card = res.getCardById('carpenters-hammer-a014')
    const cost = { stone: 12, reed: 6 }
    const result = card.modifyMultiRoomCost(null, cost, 2, 'stone')
    expect(result).toEqual({ stone: 8, reed: 4 })
  })

  test('does not discount for building only 1 room', () => {
    const card = res.getCardById('carpenters-hammer-a014')
    const cost = { wood: 5, reed: 2 }
    const result = card.modifyMultiRoomCost(null, cost, 1, 'wood')
    expect(result).toEqual({ wood: 5, reed: 2 })
  })

  test('does not go below zero', () => {
    const card = res.getCardById('carpenters-hammer-a014')
    const cost = { wood: 1, reed: 1 }
    const result = card.modifyMultiRoomCost(null, cost, 2, 'wood')
    expect(result).toEqual({ wood: 0, reed: 0 })
  })
})
