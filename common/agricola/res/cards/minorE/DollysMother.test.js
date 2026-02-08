const res = require('../../index.js')

describe('Dolly\'s Mother (E084)', () => {
  test('can hold 1 sheep', () => {
    const card = res.getCardById('dollys-mother-e084')
    expect(card.holdsAnimals).toEqual({ sheep: 1 })
  })

  test('modifies sheep breeding requirement to 1', () => {
    const card = res.getCardById('dollys-mother-e084')

    const result = card.modifySheepBreedingRequirement(null, null)

    expect(result).toBe(1)
  })

  test('has 1 vps', () => {
    const card = res.getCardById('dollys-mother-e084')
    expect(card.vps).toBe(1)
  })
})
