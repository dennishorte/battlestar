const card = require('./conflict-desert-power.js')

describe('conflict-desert-power', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-desert-power')
    expect(card.name).toBe('Desert Power')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
