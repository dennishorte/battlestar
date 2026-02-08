const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Doctor (E092)', () => {
  test('sets used to false on play', () => {
    const card = res.getCardById('field-doctor-e092')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.used).toBe(false)
  })

  test('allows family growth without room when not used and has 2 rooms surrounded by 4 fields', () => {
    const card = res.getCardById('field-doctor-e092')
    card.used = false

    const mockPlayer = {
      getRoomCount: () => 2,
      getRoomsSurroundedByFields: () => 4,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(true)
  })

  test('does not allow family growth without room when already used', () => {
    const card = res.getCardById('field-doctor-e092')
    card.used = true

    const mockPlayer = {
      getRoomCount: () => 2,
      getRoomsSurroundedByFields: () => 4,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(false)
  })

  test('does not allow family growth without room when not exactly 2 rooms', () => {
    const card = res.getCardById('field-doctor-e092')
    card.used = false

    const mockPlayer = {
      getRoomCount: () => 3,
      getRoomsSurroundedByFields: () => 4,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(false)
  })

  test('does not allow family growth without room when fewer than 4 surrounding fields', () => {
    const card = res.getCardById('field-doctor-e092')
    card.used = false

    const mockPlayer = {
      getRoomCount: () => 2,
      getRoomsSurroundedByFields: () => 3,
    }

    expect(card.allowsFamilyGrowthWithoutRoom(mockPlayer)).toBe(false)
  })

  test('sets used to true on family growth without room', () => {
    const card = res.getCardById('field-doctor-e092')
    card.used = false

    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onFamilyGrowthWithoutRoom(game, dennis)

    expect(card.used).toBe(true)
  })
})
