const res = require('../../index.js')

describe('Drinking Trough (A012)', () => {
  test('increases pasture capacity by 2', () => {
    const card = res.getCardById('drinking-trough-a012')
    const increased = card.modifyPastureCapacity(null, {}, 4)
    expect(increased).toBe(6)
  })
})
