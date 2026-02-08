const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Melon Patch (E069)', () => {
  test('is a field card that can only grow vegetables', () => {
    const card = res.getCardById('melon-patch-e069')
    expect(card.isField).toBe(true)
    expect(card.fieldCrop).toBe('vegetables')
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('melon-patch-e069')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    let addedField = null
    dennis.addVirtualField = (field) => {
      addedField = field
    }

    card.onPlay(game, dennis)

    expect(addedField).not.toBeNull()
    expect(addedField.cardId).toBe('melon-patch-e069')
    expect(addedField.label).toBe('Melon Patch')
    expect(addedField.cropRestriction).toBe('vegetables')
    expect(addedField.onHarvestLast).toBe(true)
  })

  test('offers free plow when harvesting last vegetable', () => {
    const card = res.getCardById('melon-patch-e069')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerFreePlow = (player, sourceCard) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
    }

    card.onHarvestLast(game, dennis)

    expect(offerMade).toBe(true)
  })
})
