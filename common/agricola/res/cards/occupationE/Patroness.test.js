const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Patroness (E163)', () => {
  test('offers building resource choice when playing an occupation', () => {
    const card = res.getCardById('patroness-e163')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBuildingResourceChoice = jest.fn()
    game.actions.offerBuildingResourceChoice = offerBuildingResourceChoice

    card.onPlayOccupation(game, dennis)

    expect(offerBuildingResourceChoice).toHaveBeenCalledWith(dennis, card)
  })
})
