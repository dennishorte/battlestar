const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Shed Builder (E114)', () => {
  test('gives 1 grain when building 1st stable', () => {
    const card = res.getCardById('shed-builder-e114')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'grain') {
        dennis.grain += amount
      }
    })

    card.onBuildStable(game, dennis, 1)

    expect(dennis.addResource).toHaveBeenCalledWith('grain', 1)
  })

  test('gives 1 grain when building 2nd stable', () => {
    const card = res.getCardById('shed-builder-e114')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onBuildStable(game, dennis, 2)

    expect(dennis.addResource).toHaveBeenCalledWith('grain', 1)
  })

  test('gives 1 vegetable when building 3rd stable', () => {
    const card = res.getCardById('shed-builder-e114')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })

    card.onBuildStable(game, dennis, 3)

    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('gives 1 vegetable when building 4th stable', () => {
    const card = res.getCardById('shed-builder-e114')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onBuildStable(game, dennis, 4)

    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('gives nothing when building 5th stable', () => {
    const card = res.getCardById('shed-builder-e114')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onBuildStable(game, dennis, 5)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
