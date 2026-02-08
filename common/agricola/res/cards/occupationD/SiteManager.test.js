const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Site Manager (OccD 095)', () => {
  test('offers to build major improvement with food substitution on play', () => {
    const card = res.getCardById('site-manager-d095')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuildMajorWithFoodSubstitution: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuildMajorWithFoodSubstitution).toHaveBeenCalledWith(dennis, card)
  })
})
