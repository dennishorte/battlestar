const card = require('./seek-allies.js')

describe('Seek Allies', () => {
  test('data', () => {
    expect(card.id).toBe('seek-allies')
    expect(card.name).toBe('Seek Allies')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
