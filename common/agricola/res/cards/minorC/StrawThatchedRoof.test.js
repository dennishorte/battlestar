const res = require('../../index.js')

describe('Straw-thatched Roof (C014)', () => {
  test('removes reed from build room cost', () => {
    const card = res.getCardById('straw-thatched-roof-c014')
    const modified = card.modifyBuildCost(null, { wood: 5, reed: 2 }, 'build-room')
    expect(modified).toEqual({ wood: 5 })
    expect(modified.reed).toBeUndefined()
  })

  test('removes reed from renovation cost', () => {
    const card = res.getCardById('straw-thatched-roof-c014')
    const modified = card.modifyBuildCost(null, { clay: 5, reed: 1 }, 'renovate')
    expect(modified).toEqual({ clay: 5 })
    expect(modified.reed).toBeUndefined()
  })
})
