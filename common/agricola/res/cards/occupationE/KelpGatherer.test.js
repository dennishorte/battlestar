const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Kelp Gatherer (E160)', () => {
  test('gives food to fishing player and vegetable to card owner', () => {
    const card = res.getCardById('kelp-gatherer-e160')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.vegetables = 0
    micah.food = 0

    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'vegetables') {
        dennis.vegetables += amount
      }
    })
    micah.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        micah.food += amount
      }
    })

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(micah.addResource).toHaveBeenCalledWith('food', 1)
    expect(dennis.addResource).toHaveBeenCalledWith('vegetables', 1)
  })

  test('does not trigger when card owner uses fishing', () => {
    const card = res.getCardById('kelp-gatherer-e160')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    card.onAnyAction(game, dennis, 'fishing', dennis)

    expect(dennis.addResource).not.toHaveBeenCalled()
  })

  test('does not trigger for non-fishing actions', () => {
    const card = res.getCardById('kelp-gatherer-e160')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.addResource = jest.fn()
    micah.addResource = jest.fn()

    card.onAnyAction(game, micah, 'forest', dennis)

    expect(micah.addResource).not.toHaveBeenCalled()
    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
