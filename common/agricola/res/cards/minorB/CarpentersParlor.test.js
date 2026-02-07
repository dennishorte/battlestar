const res = require('../../index.js')

describe("Carpenter's Parlor (B013)", () => {
  test('reduces wooden room cost to 2 wood and 2 reed', () => {
    const card = res.getCardById('carpenters-parlor-b013')
    const mockPlayer = { roomType: 'wood' }
    const modified = card.modifyBuildCost(mockPlayer, { wood: 5, reed: 2 }, 'build-room')
    expect(modified).toEqual({ wood: 2, reed: 2 })
  })

  test('does not affect non-wood houses', () => {
    const card = res.getCardById('carpenters-parlor-b013')
    const mockPlayer = { roomType: 'clay' }
    const original = { clay: 5, reed: 2 }
    const modified = card.modifyBuildCost(mockPlayer, original, 'build-room')
    expect(modified).toEqual(original)
  })
})
