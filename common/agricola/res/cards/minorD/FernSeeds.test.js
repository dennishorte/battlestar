const res = require('../../index.js')

describe('Fern Seeds (D008)', () => {
  test('has onPlay hook and correct prereqs', () => {
    const card = res.getCardById('fern-seeds-d008')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ emptyFields: 1, plantedFields: 2 })
  })
})
