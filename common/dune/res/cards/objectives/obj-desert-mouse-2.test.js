'use strict'

const card = require('./obj-desert-mouse-2.js')

describe('obj-desert-mouse-2', () => {
  test('has expected id and name', () => {
    expect(card.id).toBe('obj-desert-mouse-2')
    expect(card.name).toBe('Desert Mouse (First Player)')
  })

  test('has Uprising source and compatibility', () => {
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
