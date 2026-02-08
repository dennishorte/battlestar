const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Artichoke Field (E072)', () => {
  test('is a field card', () => {
    const card = res.getCardById('artichoke-field-e072')
    expect(card.isField).toBe(true)
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('artichoke-field-e072')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    let addedField = null
    dennis.addVirtualField = (field) => {
      addedField = field
    }

    card.onPlay(game, dennis)

    expect(addedField).not.toBeNull()
    expect(addedField.cardId).toBe('artichoke-field-e072')
    expect(addedField.label).toBe('Artichoke Field')
    expect(addedField.cropRestriction).toBeNull()
    expect(addedField.onHarvest).toBe(true)
  })

  test('gives 1 food when harvesting at least 1 good', () => {
    const card = res.getCardById('artichoke-field-e072')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onHarvest(game, dennis, 2)

    expect(dennis.food).toBe(1)
  })

  test('gives no food when harvesting 0 goods', () => {
    const card = res.getCardById('artichoke-field-e072')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onHarvest(game, dennis, 0)

    expect(dennis.food).toBe(0)
  })
})
