const res = require('../../index.js')

describe('Heirloom (E029)', () => {
  test('has 2 vps', () => {
    const card = res.getCardById('heirloom-e029')
    expect(card.vps).toBe(2)
  })

  test('requires person on day-laborer action', () => {
    const card = res.getCardById('heirloom-e029')
    expect(card.prereqs.personOnAction).toBe('day-laborer')
  })

  test('has no additional effect', () => {
    const card = res.getCardById('heirloom-e029')
    expect(card.onPlay).toBeUndefined()
    expect(card.onAction).toBeUndefined()
  })
})
