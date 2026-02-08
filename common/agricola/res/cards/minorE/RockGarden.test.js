const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Rock Garden (E080)', () => {
  test('is a field card that can only grow stone', () => {
    const card = res.getCardById('rock-garden-e080')
    expect(card.isField).toBe(true)
    expect(card.fieldCrop).toBe('stone')
    expect(card.fieldSize).toBe(3)
  })

  test('adds virtual field on play', () => {
    const card = res.getCardById('rock-garden-e080')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    let addedField = null
    dennis.addVirtualField = (field) => {
      addedField = field
    }

    card.onPlay(game, dennis)

    expect(addedField).not.toBeNull()
    expect(addedField.cardId).toBe('rock-garden-e080')
    expect(addedField.label).toBe('Rock Garden')
    expect(addedField.cropRestriction).toBe('stone')
    expect(addedField.sowingAmount).toBe(6)
  })
})
