const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Beanfield (B068)', () => {
  test('adds virtual field on play', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 1,
        hand: ['beanfield-b068'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'beanfield-b068')

    const dennis = t.player(game)
    expect(dennis.virtualFields.length).toBe(1)
    expect(dennis.virtualFields[0].cardId).toBe('beanfield-b068')
    expect(dennis.virtualFields[0].label).toBe('Beanfield')
    expect(dennis.virtualFields[0].cropRestriction).toBe('vegetables')
  })

  test('virtual field can be sown with vegetables', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 1,
        vegetables: 1,
        hand: ['beanfield-b068'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'beanfield-b068')

    const dennis = t.player(game)
    const fieldId = dennis.virtualFields[0].id

    expect(dennis.canSowVirtualField(fieldId, 'vegetables')).toBe(true)
    expect(dennis.canSowVirtualField(fieldId, 'grain')).toBe(false)

    dennis.sowVirtualField(fieldId, 'vegetables')
    expect(dennis.virtualFields[0].crop).toBe('vegetables')
    expect(dennis.virtualFields[0].cropCount).toBe(2)
    expect(dennis.vegetables).toBe(0)
  })

  test('virtual field harvests correctly', () => {
    const game = t.fixture({ cardSets: ['minorB'] })
    t.setBoard(game, {
      dennis: {
        food: 1,
        vegetables: 1,
        hand: ['beanfield-b068'],
        occupations: ['wood-cutter', 'firewood-collector'],
      },
    })
    game.run()

    t.playCard(game, 'dennis', 'beanfield-b068')

    const dennis = t.player(game)
    const fieldId = dennis.virtualFields[0].id
    dennis.sowVirtualField(fieldId, 'vegetables')

    // Harvest once
    const result = dennis.harvestFields()
    expect(result.harvested.vegetables).toBe(1)
    expect(dennis.vegetables).toBe(1)
    expect(dennis.virtualFields[0].cropCount).toBe(1)

    // Harvest again - last vegetable
    const result2 = dennis.harvestFields()
    expect(result2.harvested.vegetables).toBe(1)
    expect(dennis.vegetables).toBe(2)
    expect(dennis.virtualFields[0].cropCount).toBe(0)
    expect(dennis.virtualFields[0].crop).toBe(null)
  })

  test('has providesVegetableField flag', () => {
    const card = res.getCardById('beanfield-b068')
    expect(card.providesVegetableField).toBe(true)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('beanfield-b068')
    expect(card.vps).toBe(1)
  })
})
