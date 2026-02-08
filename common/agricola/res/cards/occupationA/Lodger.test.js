const res = require('../../index.js')

describe('Lodger (OccA 127)', () => {
  test('provides room flag is set', () => {
    const card = res.getCardById('lodger-a127')

    expect(card.providesRoom).toBe(true)
  })

  test('provides room until round 9', () => {
    const card = res.getCardById('lodger-a127')

    expect(card.providesRoomUntilRound).toBe(9)
  })
})
