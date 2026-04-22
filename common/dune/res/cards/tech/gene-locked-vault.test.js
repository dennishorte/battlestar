'use strict'

const card = require('./gene-locked-vault.js')

describe('Gene-Locked Vault', () => {
  test('card data', () => {
    expect(card.id).toBe('gene-locked-vault')
    expect(card.name).toBe('Gene-Locked Vault')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
