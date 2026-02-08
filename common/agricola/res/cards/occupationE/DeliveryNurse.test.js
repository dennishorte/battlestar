const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Delivery Nurse (E151)', () => {
  test('sets used to false on play', () => {
    const card = res.getCardById('delivery-nurse-e151')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.used).toBe(false)
  })

  test('allows family growth without room when not used and has all animal types', () => {
    const card = res.getCardById('delivery-nurse-e151')
    card.used = false

    const mockPlayer = {
      hasAllAnimalTypes: () => true,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(true)
  })

  test('does not allow family growth without room when already used', () => {
    const card = res.getCardById('delivery-nurse-e151')
    card.used = true

    const mockPlayer = {
      hasAllAnimalTypes: () => true,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(false)
  })

  test('does not allow family growth without room when missing animal types', () => {
    const card = res.getCardById('delivery-nurse-e151')
    card.used = false

    const mockPlayer = {
      hasAllAnimalTypes: () => false,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(false)
  })

  test('sets used to true on family growth without room', () => {
    const card = res.getCardById('delivery-nurse-e151')
    card.used = false

    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onFamilyGrowthWithoutRoom(game, dennis)

    expect(card.used).toBe(true)
  })
})
