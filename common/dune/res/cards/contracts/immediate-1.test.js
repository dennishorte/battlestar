const card = require('./immediate-1.js')

describe('Immediate (contract) [immediate-1]', () => {
  test('data', () => {
    expect(card.id).toBe('immediate-1')
    expect(card.name).toBe('Immediate')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
