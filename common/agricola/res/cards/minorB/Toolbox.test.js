const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Toolbox (B027)', () => {
  test('offers major improvement after building room', () => {
    const card = res.getCardById('toolbox-b027')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerToolboxMajor = jest.fn()

    card.onBuildRoom(game, dennis)

    expect(game.actions.offerToolboxMajor).toHaveBeenCalledWith(dennis, card)
  })

  test('offers major improvement after building stable', () => {
    const card = res.getCardById('toolbox-b027')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerToolboxMajor = jest.fn()

    card.onBuildStable(game, dennis)

    expect(game.actions.offerToolboxMajor).toHaveBeenCalledWith(dennis, card)
  })

  test('offers major improvement after building fences', () => {
    const card = res.getCardById('toolbox-b027')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    game.actions.offerToolboxMajor = jest.fn()

    card.onBuildFences(game, dennis)

    expect(game.actions.offerToolboxMajor).toHaveBeenCalledWith(dennis, card)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('toolbox-b027')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
