const card = require('./immediate-2.js')

describe('Immediate (contract) [immediate-2]', () => {
  test('data', () => {
    expect(card.id).toBe('immediate-2')
    expect(card.name).toBe('Immediate')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
  })
})
