const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Pioneer (E105)', () => {
  test('offers building resource and gives food on play', () => {
    const card = res.getCardById('pioneer-e105')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.addResource = jest.fn((type, amount) => {
      if (type === 'food') {
        dennis.food += amount
      }
    })

    const offerBuildingResourceChoice = jest.fn()
    game.actions.offerBuildingResourceChoice = offerBuildingResourceChoice

    card.onPlay(game, dennis)

    expect(offerBuildingResourceChoice).toHaveBeenCalledWith(dennis, card)
    expect(dennis.addResource).toHaveBeenCalledWith('food', 1)
  })

  test('offers building resource and gives food before using most recent action space', () => {
    const card = res.getCardById('pioneer-e105')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getActionSpaceRound = () => 5
    game.getMostRecentlyRevealedRound = () => 5

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    const offerBuildingResourceChoice = jest.fn()
    game.actions.offerBuildingResourceChoice = offerBuildingResourceChoice

    card.onBeforeAction(game, dennis, 'some-action')

    expect(offerBuildingResourceChoice).toHaveBeenCalledWith(dennis, card)
    expect(dennis.addResource).toHaveBeenCalledWith('food', 1)
  })

  test('does not trigger for non-most-recent action space', () => {
    const card = res.getCardById('pioneer-e105')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.getActionSpaceRound = () => 3
    game.getMostRecentlyRevealedRound = () => 5

    const dennis = t.player(game)
    dennis.addResource = jest.fn()

    const offerBuildingResourceChoice = jest.fn()
    game.actions.offerBuildingResourceChoice = offerBuildingResourceChoice

    card.onBeforeAction(game, dennis, 'some-action')

    expect(offerBuildingResourceChoice).not.toHaveBeenCalled()
    expect(dennis.addResource).not.toHaveBeenCalled()
  })
})
