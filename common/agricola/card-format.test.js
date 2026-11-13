const { fieldsMissingFromFormatDoc } = require('../scripts/list-agricola-card-fields.js')

describe('Agricola card format', () => {
  test('names every field found on a card', () => {
    expect(fieldsMissingFromFormatDoc()).toEqual([])
  })
})
