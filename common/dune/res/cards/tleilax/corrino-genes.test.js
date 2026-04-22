const card = require('./corrino-genes.js')

describe('Corrino Genes', () => {
  test('data', () => {
    expect(card.id).toBe('corrino-genes')
    expect(card.name).toBe('Corrino Genes')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
