'use strict'

const card = require('./obj-crysknife-1.js')

describe('obj-crysknife-1', () => {
  test('has expected id and name', () => {
    expect(card.id).toBe('obj-crysknife-1')
    expect(card.name).toBe('Crysknife')
  })

  test('has Uprising source and compatibility', () => {
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
