const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Flax Farmer (E137)', () => {
  test('gives 1 grain when using reed bank', () => {
    const card = res.getCardById('flax-farmer-e137')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'grain') {
        dennis.grain += amount
      }
    })

    card.onAction(game, dennis, 'reed-bank')

    expect(dennis.addResource).toHaveBeenCalledWith('grain', 1)
  })

  test('gives 1 reed when using grain seeds', () => {
    const card = res.getCardById('flax-farmer-e137')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'reed') {
        dennis.reed += amount
      }
    })

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.addResource).toHaveBeenCalledWith('reed', 1)
  })

  test('does not give resources for other actions', () => {
    const card = res.getCardById('flax-farmer-e137')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
