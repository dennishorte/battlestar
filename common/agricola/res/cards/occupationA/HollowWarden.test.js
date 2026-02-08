const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hollow Warden (OccA 139)', () => {
  test('offers to build fireplace on play', () => {
    const card = res.getCardById('hollow-warden-a139')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuildFireplace: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuildFireplace).toHaveBeenCalledWith(dennis, card)
  })

  test('gives 1 food when using hollow space', () => {
    const card = res.getCardById('hollow-warden-a139')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-clay-2')

    expect(dennis.food).toBe(1)
  })

  test('does not give food for other actions', () => {
    const card = res.getCardById('hollow-warden-a139')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(0)
  })
})
