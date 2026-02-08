const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Delayed Wayfarer (E125)', () => {
  test('offers building resource choice and sets pending flag on play', () => {
    const card = res.getCardById('delayed-wayfarer-e125')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBuildingResourceChoice = jest.fn()
    game.actions.offerBuildingResourceChoice = offerBuildingResourceChoice

    card.onPlay(game, dennis)

    expect(offerBuildingResourceChoice).toHaveBeenCalledWith(dennis, card)
    expect(dennis.delayedWayfarerPending).toBe(true)
  })

  test('offers place person when all people placed and pending flag is set', () => {
    const card = res.getCardById('delayed-wayfarer-e125')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.delayedWayfarerPending = true
    dennis.hasPersonInSupply = () => true

    const offerPlacePersonFromSupply = jest.fn()
    game.actions.offerPlacePersonFromSupply = offerPlacePersonFromSupply

    card.onAllPeoplePlaced(game, dennis)

    expect(offerPlacePersonFromSupply).toHaveBeenCalledWith(dennis, card)
    expect(dennis.delayedWayfarerPending).toBe(false)
  })

  test('does not offer place person if no pending flag', () => {
    const card = res.getCardById('delayed-wayfarer-e125')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.delayedWayfarerPending = false
    dennis.hasPersonInSupply = () => true

    const offerPlacePersonFromSupply = jest.fn()
    game.actions.offerPlacePersonFromSupply = offerPlacePersonFromSupply

    card.onAllPeoplePlaced(game, dennis)

    expect(offerPlacePersonFromSupply).not.toHaveBeenCalled()
  })

  test('does not offer place person if no person in supply', () => {
    const card = res.getCardById('delayed-wayfarer-e125')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.delayedWayfarerPending = true
    dennis.hasPersonInSupply = () => false

    const offerPlacePersonFromSupply = jest.fn()
    game.actions.offerPlacePersonFromSupply = offerPlacePersonFromSupply

    card.onAllPeoplePlaced(game, dennis)

    expect(offerPlacePersonFromSupply).not.toHaveBeenCalled()
  })
})
