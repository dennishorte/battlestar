const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Earthenware Potter (OccD 099)', () => {
  test('sets playedEarly to true when played in round 4 or before', () => {
    const card = res.getCardById('earthenware-potter-d099')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 4

    card.onPlay(game, dennis)

    expect(card.playedEarly).toBe(true)
  })

  test('sets playedEarly to false when played after round 4', () => {
    const card = res.getCardById('earthenware-potter-d099')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 5

    card.onPlay(game, dennis)

    expect(card.playedEarly).toBe(false)
  })

  test('offers bonus after final harvest if played early', () => {
    const card = res.getCardById('earthenware-potter-d099')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.playedEarly = true
    game.actions = { offerEarthenwarePotterBonus: jest.fn() }

    card.onAfterFinalHarvest(game, dennis)

    expect(game.actions.offerEarthenwarePotterBonus).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer bonus after final harvest if not played early', () => {
    const card = res.getCardById('earthenware-potter-d099')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.playedEarly = false
    game.actions = { offerEarthenwarePotterBonus: jest.fn() }

    card.onAfterFinalHarvest(game, dennis)

    expect(game.actions.offerEarthenwarePotterBonus).not.toHaveBeenCalled()
  })
})
