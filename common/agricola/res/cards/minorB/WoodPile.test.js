const res = require('../../index.js')

describe('Wood Pile (B004)', () => {
  test('gives wood equal to people on accumulation spaces', () => {
    const card = res.getCardById('wood-pile-b004')
    expect(card.onPlay).toBeDefined()
  })
})
