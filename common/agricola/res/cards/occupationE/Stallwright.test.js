const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stallwright (E089)', () => {
  test('offers free stable when this occupation is 2nd', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 2

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).toHaveBeenCalledWith(dennis, card)
  })

  test('offers free stable when this occupation is 3rd', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 3

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).toHaveBeenCalledWith(dennis, card)
  })

  test('offers free stable when this occupation is 5th', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 5

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).toHaveBeenCalledWith(dennis, card)
  })

  test('offers free stable when this occupation is 7th', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 7

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer free stable when occupation count is 1', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).not.toHaveBeenCalled()
  })

  test('does not offer free stable when occupation count is 4', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 4

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlay(game, dennis)

    expect(offerBuildFreeStable).not.toHaveBeenCalled()
  })

  test('offers free stable when playing another occupation at count 3', () => {
    const card = res.getCardById('stallwright-e089')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 3

    const offerBuildFreeStable = jest.fn()
    game.actions.offerBuildFreeStable = offerBuildFreeStable

    card.onPlayOccupation(game, dennis)

    expect(offerBuildFreeStable).toHaveBeenCalledWith(dennis, card)
  })
})
