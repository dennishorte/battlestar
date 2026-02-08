const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Vegetable Vendor (E141)', () => {
  test('gives 1 vegetable when using major improvement action', () => {
    const card = res.getCardById('vegetable-vendor-e141')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })

    card.onAction(game, dennis, 'major-improvement')

    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('offers improvement when using vegetable seeds action', () => {
    const card = res.getCardById('vegetable-vendor-e141')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerPlayImprovement = jest.fn()
    game.actions.offerPlayImprovement = offerPlayImprovement

    card.onAction(game, dennis, 'take-vegetables')

    expect(offerPlayImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('does not give anything for other actions', () => {
    const card = res.getCardById('vegetable-vendor-e141')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    const offerPlayImprovement = jest.fn()
    game.actions.offerPlayImprovement = offerPlayImprovement

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
    expect(offerPlayImprovement).not.toHaveBeenCalled()
  })
})
