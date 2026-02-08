const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Recluse (E111)', () => {
  test('gives 1 food at round start when no minor improvements', () => {
    const card = res.getCardById('recluse-e111')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMinorImprovementCount = () => 0
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    card.onRoundStart(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('food', 1)
  })

  test('does not give food when player has minor improvements', () => {
    const card = res.getCardById('recluse-e111')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMinorImprovementCount = () => 2
    dennis.addResource = jest.fn()

    card.onRoundStart(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })

  test('gives 1 wood at harvest start when no minor improvements', () => {
    const card = res.getCardById('recluse-e111')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMinorImprovementCount = () => 0
    dennis.wood = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'wood') {
        dennis.wood += amount
      }
    })

    card.onHarvestStart(game, dennis)

    expect(dennis.addResource).toHaveBeenCalledWith('wood', 1)
  })

  test('does not give wood when player has minor improvements', () => {
    const card = res.getCardById('recluse-e111')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getMinorImprovementCount = () => 1
    dennis.addResource = jest.fn()

    card.onHarvestStart(game, dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
