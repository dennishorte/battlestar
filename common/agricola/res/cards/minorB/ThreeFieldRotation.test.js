const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Three-Field Rotation (B061)', () => {
  test('gives 3 food at harvest with grain, vegetable, and empty fields', () => {
    const card = res.getCardById('three-field-rotation-b061')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = jest.fn().mockReturnValue(1)
    dennis.farmyard = {
      grid: [
        [
          { type: 'field', crop: 'vegetables' },
          { type: 'field', crop: null },
          { type: 'room' },
        ],
        [
          { type: 'room' },
          { type: 'empty' },
          { type: 'empty' },
        ],
      ]
    }

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(3)
  })

  test('does not give food without grain field', () => {
    const card = res.getCardById('three-field-rotation-b061')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = jest.fn().mockReturnValue(0)
    dennis.farmyard = {
      grid: [
        [
          { type: 'field', crop: 'vegetables' },
          { type: 'field', crop: null },
        ],
      ]
    }

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('does not give food without vegetable field', () => {
    const card = res.getCardById('three-field-rotation-b061')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = jest.fn().mockReturnValue(1)
    dennis.farmyard = {
      grid: [
        [
          { type: 'field', crop: 'grain' },
          { type: 'field', crop: null },
        ],
      ]
    }

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('does not give food without empty field', () => {
    const card = res.getCardById('three-field-rotation-b061')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getGrainFieldCount = jest.fn().mockReturnValue(1)
    dennis.farmyard = {
      grid: [
        [
          { type: 'field', crop: 'vegetables' },
          { type: 'field', crop: 'grain' },
        ],
      ]
    }

    card.onHarvest(game, dennis)

    expect(dennis.food).toBe(0)
  })

  test('requires 3 occupations', () => {
    const card = res.getCardById('three-field-rotation-b061')
    expect(card.prereqs.occupations).toBe(3)
  })

  test('has no cost', () => {
    const card = res.getCardById('three-field-rotation-b061')
    expect(card.cost).toEqual({})
  })
})
