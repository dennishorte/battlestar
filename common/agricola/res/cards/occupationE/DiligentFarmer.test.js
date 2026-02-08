const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Diligent Farmer (E127)', () => {
  test('offers free room when player has 3 or more max score categories', () => {
    const card = res.getCardById('diligent-farmer-e127')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCategoriesWithMaxScore = () => 3

    const buildFreeRoom = jest.fn()
    game.actions.buildFreeRoom = buildFreeRoom

    card.onPlay(game, dennis)

    expect(buildFreeRoom).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer free room when player has fewer than 3 max score categories', () => {
    const card = res.getCardById('diligent-farmer-e127')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getCategoriesWithMaxScore = () => 2

    const buildFreeRoom = jest.fn()
    game.actions.buildFreeRoom = buildFreeRoom

    card.onPlay(game, dennis)

    expect(buildFreeRoom).not.toHaveBeenCalled()
  })
})
