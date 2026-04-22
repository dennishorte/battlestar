'use strict'

const card = require('./obj-crysknife-2.js')

describe('obj-crysknife-2', () => {
  test('has expected id and name', () => {
    expect(card.id).toBe('obj-crysknife-2')
    expect(card.name).toBe('Crysknife')
  })

  test('has Uprising source and compatibility', () => {
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
