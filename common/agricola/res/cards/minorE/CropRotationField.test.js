const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Crop Rotation Field (E070)', () => {
  test('is a field card', () => {
    const card = res.getCardById('crop-rotation-field-e070')
    expect(card.isField).toBe(true)
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('crop-rotation-field-e070')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    let addedField = null
    dennis.addVirtualField = (field) => {
      addedField = field
    }

    card.onPlay(game, dennis)

    expect(addedField).not.toBeNull()
    expect(addedField.cardId).toBe('crop-rotation-field-e070')
    expect(addedField.label).toBe('Crop Rotation')
    expect(addedField.cropRestriction).toBeNull()
    expect(addedField.onHarvestLast).toBe(true)
  })

  test('offers to sow vegetables after harvesting last grain', () => {
    const card = res.getCardById('crop-rotation-field-e070')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerSowOnCard = (player, sourceCard, cropType) => {
      offerMade = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(cropType).toBe('vegetables')
    }

    card.onHarvestLast(game, dennis, 'grain')

    expect(offerMade).toBe(true)
  })

  test('offers to sow grain after harvesting last vegetables', () => {
    const card = res.getCardById('crop-rotation-field-e070')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let offerMade = false
    game.actions.offerSowOnCard = (player, sourceCard, cropType) => {
      offerMade = true
      expect(cropType).toBe('grain')
    }

    card.onHarvestLast(game, dennis, 'vegetables')

    expect(offerMade).toBe(true)
  })
})
