const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cherry Orchard (E068)', () => {
  test('is a field card that can only grow wood', () => {
    const card = res.getCardById('cherry-orchard-e068')
    expect(card.isField).toBe(true)
    expect(card.fieldCrop).toBe('wood')
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('cherry-orchard-e068')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    let addedField = null
    dennis.addVirtualField = (field) => {
      addedField = field
    }

    card.onPlay(game, dennis)

    expect(addedField).not.toBeNull()
    expect(addedField.cardId).toBe('cherry-orchard-e068')
    expect(addedField.label).toBe('Cherry Orchard')
    expect(addedField.cropRestriction).toBe('wood')
    expect(addedField.onHarvestLast).toBe(true)
  })

  test('gives 1 vegetable when harvesting last wood', () => {
    const card = res.getCardById('cherry-orchard-e068')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0

    card.onHarvestLast(game, dennis)

    expect(dennis.vegetables).toBe(1)
  })
})
