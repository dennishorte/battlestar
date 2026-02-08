const res = require('../../index.js')

describe('Clay Supports (D015)', () => {
  test('modifies clay room build cost', () => {
    const card = res.getCardById('clay-supports-d015')
    const player = { roomType: 'clay' }
    const originalCost = { clay: 5, reed: 2 }

    const newCost = card.modifyBuildCost(player, originalCost, 'build-room')

    expect(newCost).toEqual({ clay: 2, wood: 1, reed: 1 })
  })

  test('does not modify cost for non-clay rooms', () => {
    const card = res.getCardById('clay-supports-d015')
    const player = { roomType: 'wood' }
    const originalCost = { wood: 5, reed: 2 }

    const newCost = card.modifyBuildCost(player, originalCost, 'build-room')

    expect(newCost).toBe(originalCost)
  })

  test('does not modify cost for non-room actions', () => {
    const card = res.getCardById('clay-supports-d015')
    const player = { roomType: 'clay' }
    const originalCost = { clay: 5, reed: 2 }

    const newCost = card.modifyBuildCost(player, originalCost, 'build-stable')

    expect(newCost).toBe(originalCost)
  })

  test('has correct properties', () => {
    const card = res.getCardById('clay-supports-d015')
    expect(card.cost).toEqual({ wood: 2 })
  })
})
