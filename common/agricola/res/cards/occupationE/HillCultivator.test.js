const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hill Cultivator (E121)', () => {
  test('gives 2 clay when using grain seeds action', () => {
    const card = res.getCardById('hill-cultivator-e121')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'clay') {
        dennis.clay += amount
      }
    })

    card.onAction(game, dennis, 'take-grain')

    expect(dennis.addResource).toHaveBeenCalledWith('clay', 2)
  })

  test('gives 3 clay when using vegetable seeds action', () => {
    const card = res.getCardById('hill-cultivator-e121')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'clay') {
        dennis.clay += amount
      }
    })

    card.onAction(game, dennis, 'take-vegetables')

    expect(dennis.addResource).toHaveBeenCalledWith('clay', 3)
  })

  test('does not give clay for other actions', () => {
    const card = res.getCardById('hill-cultivator-e121')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAction(game, dennis, 'forest')

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
