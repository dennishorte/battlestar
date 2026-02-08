const res = require('../../index.js')

describe("Witches' Dance Floor (D025)", () => {
  test('adds virtual field on play', () => {
    const card = res.getCardById('witches-dance-floor-d025')
    const addVirtualFieldCalled = []
    const player = {
      addVirtualField: (opts) => {
        addVirtualFieldCalled.push(opts)
      },
    }
    const game = { log: { add: jest.fn() } }

    card.onPlay(game, player)

    expect(addVirtualFieldCalled).toHaveLength(1)
    expect(addVirtualFieldCalled[0].cardId).toBe('witches-dance-floor-d025')
    expect(addVirtualFieldCalled[0].label).toBe("Witches' Floor")
    expect(addVirtualFieldCalled[0].cropRestriction).toBe(null)
  })

  test('has fireplace-like anytime conversions', () => {
    const card = res.getCardById('witches-dance-floor-d025')
    expect(card.anytimeConversions).toEqual([
      { from: 'sheep', to: 'food', rate: 2 },
      { from: 'boar', to: 'food', rate: 2 },
      { from: 'vegetables', to: 'food', rate: 2 },
    ])
  })

  test('has baking conversion', () => {
    const card = res.getCardById('witches-dance-floor-d025')
    expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
  })

  test('has correct properties', () => {
    const card = res.getCardById('witches-dance-floor-d025')
    expect(card.providesField).toBe(true)
    expect(card.countsAsOccupation).toBe(true)
    expect(card.countsAsMajorOrMinor).toBe(true)
    expect(card.isFireplace).toBe(true)
    expect(card.cost).toEqual({})
  })
})
