const constants = require('../res/constants')

describe('Combat Marker Overflow', () => {

  test('strength values over 20 are mathematically possible', () => {
    // 11 troops * 2 strength = 22, which exceeds 20
    const strength = 11 * constants.TROOP_STRENGTH
    expect(strength).toBe(22)
    expect(strength).toBeGreaterThan(20)
  })

  test('strength calculation with mixed troops and sandworms can exceed 20', () => {
    // The game engine stores raw strength; the +20 flip is UI-only
    const expected = 8 * constants.TROOP_STRENGTH + 3 * constants.SANDWORM_STRENGTH
    expect(expected).toBe(25) // 16 + 9
    expect(expected).toBeGreaterThan(20)
  })

  test('troop and sandworm strength constants are correct', () => {
    expect(constants.TROOP_STRENGTH).toBe(2)
    expect(constants.SANDWORM_STRENGTH).toBe(3)
  })
})
