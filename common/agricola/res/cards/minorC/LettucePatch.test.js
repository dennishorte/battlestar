const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lettuce Patch (C070)', () => {
  test('has providesVegetableField flag', () => {
    const card = res.getCardById('lettuce-patch-c070')
    expect(card.providesVegetableField).toBe(true)
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('lettuce-patch-c070')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let fieldAdded = false

    dennis.addVirtualField = (fieldDef) => {
      fieldAdded = true
      expect(fieldDef.cardId).toBe('lettuce-patch-c070')
      expect(fieldDef.label).toBe('Lettuce Patch')
      expect(fieldDef.cropRestriction).toBe('vegetables')
      expect(fieldDef.onHarvest).toBe(true)
    }

    card.onPlay(game, dennis)

    expect(fieldAdded).toBe(true)
  })

  test('offers conversion on harvest when amount > 0', () => {
    const card = res.getCardById('lettuce-patch-c070')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerLettucePatchConversion = (player, amount) => {
      actionCalled = true
      expect(player).toBe(dennis)
      expect(amount).toBe(2)
    }

    card.onHarvest(game, dennis, 2)

    expect(actionCalled).toBe(true)
  })

  test('does not offer conversion on harvest when amount is 0', () => {
    const card = res.getCardById('lettuce-patch-c070')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    let actionCalled = false

    game.actions.offerLettucePatchConversion = () => {
      actionCalled = true
    }

    card.onHarvest(game, dennis, 0)

    expect(actionCalled).toBe(false)
  })
})
