const leader = require('./KotaOdaxOfIx.js')

describe('Kota Odax of Ix', () => {
  test('data', () => {
    expect(leader.name).toBe('Kota Odax of Ix')
    expect(leader.source).toBe('Bloodlines')
  })
})
