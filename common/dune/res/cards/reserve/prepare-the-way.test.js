const card = require('./prepare-the-way.js')

describe('Prepare the Way', () => {
  test('data', () => {
    expect(card.id).toBe('prepare-the-way')
    expect(card.name).toBe('Prepare the Way')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
