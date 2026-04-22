const card = require('./stitched-horror.js')

describe('Stitched Horror', () => {
  test('data', () => {
    expect(card.id).toBe('stitched-horror')
    expect(card.name).toBe('Stitched Horror')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
