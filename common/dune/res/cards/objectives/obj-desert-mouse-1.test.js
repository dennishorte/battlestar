'use strict'

const card = require('./obj-desert-mouse-1.js')

describe('obj-desert-mouse-1', () => {
  test('has expected id and name', () => {
    expect(card.id).toBe('obj-desert-mouse-1')
    expect(card.name).toBe('Desert Mouse')
  })

  test('has Uprising source and compatibility', () => {
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
