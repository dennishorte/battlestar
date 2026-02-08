const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Godmother (E113)', () => {
  test('gives 1 vegetable when taking family growth action', () => {
    const card = res.getCardById('godmother-e113')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })

    card.onAction(game, dennis, 'family-growth')

    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('gives 1 vegetable when taking family growth urgent action', () => {
    const card = res.getCardById('godmother-e113')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })

    card.onAction(game, dennis, 'family-growth-urgent')

    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('does not give vegetable for other actions', () => {
    const card = res.getCardById('godmother-e113')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'plow-field')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
