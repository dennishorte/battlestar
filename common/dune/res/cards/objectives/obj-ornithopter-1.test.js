'use strict'

const card = require('./obj-ornithopter-1.js')

describe('obj-ornithopter-1', () => {
  test('has expected id and name', () => {
    expect(card.id).toBe('obj-ornithopter-1')
    expect(card.name).toBe('Ornithopter')
  })

  test('has Uprising source and compatibility', () => {
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
