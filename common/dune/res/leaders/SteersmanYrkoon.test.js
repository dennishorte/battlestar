const leader = require('./SteersmanYrkoon.js')

describe("Steersman Y'rkoon", () => {
  test('data', () => {
    expect(leader.name).toBe("Steersman Y'rkoon")
    expect(leader.signetRingAbility).toBeNull()
  })
})
