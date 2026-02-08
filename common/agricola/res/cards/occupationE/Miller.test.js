const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Miller (E095)', () => {
  test('offers baking improvement on play', () => {
    const card = res.getCardById('miller-e095')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBuildBakingImprovement = jest.fn()
    game.actions.offerBuildBakingImprovement = offerBuildBakingImprovement

    card.onPlay(game, dennis)

    expect(offerBuildBakingImprovement).toHaveBeenCalledWith(dennis, card)
  })

  test('offers bake bread when another player uses grain seeds', () => {
    const card = res.getCardById('miller-e095')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    const offerBakeBread = jest.fn()
    game.actions.offerBakeBread = offerBakeBread

    card.onAnyAction(game, micah, 'take-grain', dennis)

    expect(offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer bake bread when card owner uses grain seeds', () => {
    const card = res.getCardById('miller-e095')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBakeBread = jest.fn()
    game.actions.offerBakeBread = offerBakeBread

    card.onAnyAction(game, dennis, 'take-grain', dennis)

    expect(offerBakeBread).not.toHaveBeenCalled()
  })

  test('does not offer bake bread for other actions', () => {
    const card = res.getCardById('miller-e095')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    const offerBakeBread = jest.fn()
    game.actions.offerBakeBread = offerBakeBread

    card.onAnyAction(game, micah, 'forest', dennis)

    expect(offerBakeBread).not.toHaveBeenCalled()
  })
})
