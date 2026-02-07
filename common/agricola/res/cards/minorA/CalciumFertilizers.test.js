const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Calcium Fertilizers (A072)', () => {
  test('adds crop to planted fields on quarry action', () => {
    const card = res.getCardById('calcium-fertilizers-a072')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    const field1 = { crop: 'grain', cropCount: 2 }
    const field2 = { crop: 'vegetables', cropCount: 1 }
    dennis.getPlantedFields = () => [field1, field2]

    let addedCrops = []
    dennis.addCropToField = (field, amount) => {
      addedCrops.push({ field, amount })
    }

    card.onAction(game, dennis, 'take-stone-1')

    expect(addedCrops.length).toBe(2)
    expect(addedCrops[0]).toEqual({ field: field1, amount: 1 })
    expect(addedCrops[1]).toEqual({ field: field2, amount: 1 })
  })

  test('does not add crop to empty fields', () => {
    const card = res.getCardById('calcium-fertilizers-a072')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    const emptyField = { crop: 'grain', cropCount: 0 }
    dennis.getPlantedFields = () => [emptyField]

    let addCropCalled = false
    dennis.addCropToField = () => {
      addCropCalled = true
    }

    card.onAction(game, dennis, 'take-stone-1')

    expect(addCropCalled).toBe(false)
  })

  test('does not trigger on non-quarry actions', () => {
    const card = res.getCardById('calcium-fertilizers-a072')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.getPlantedFields = () => [{ crop: 'grain', cropCount: 2 }]

    let addCropCalled = false
    dennis.addCropToField = () => {
      addCropCalled = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(addCropCalled).toBe(false)
  })
})
