const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forestry Studies (B028)', () => {
  test('offers free occupation when using take-wood with enough wood', () => {
    const card = res.getCardById('forestry-studies-b028')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 3
    game.actions.offerForestryStudies = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerForestryStudies).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when not enough wood', () => {
    const card = res.getCardById('forestry-studies-b028')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions.offerForestryStudies = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerForestryStudies).not.toHaveBeenCalled()
  })

  test('does not offer for other wood spaces like copse', () => {
    const card = res.getCardById('forestry-studies-b028')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions.offerForestryStudies = jest.fn()

    card.onAction(game, dennis, 'copse')

    expect(game.actions.offerForestryStudies).not.toHaveBeenCalled()
  })

  test('costs 2 food', () => {
    const card = res.getCardById('forestry-studies-b028')
    expect(card.cost).toEqual({ food: 2 })
  })
})
