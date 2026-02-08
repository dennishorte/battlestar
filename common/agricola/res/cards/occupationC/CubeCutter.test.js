const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cube Cutter (C098)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('cube-cutter-c098')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('offers exchange during field phase when player has resources', () => {
    const card = res.getCardById('cube-cutter-c098')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.food = 1
    game.actions = { offerCubeCutterExchange: jest.fn() }

    card.onFieldPhase(game, dennis)

    expect(game.actions.offerCubeCutterExchange).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer exchange when player lacks wood', () => {
    const card = res.getCardById('cube-cutter-c098')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.food = 1
    game.actions = { offerCubeCutterExchange: jest.fn() }

    card.onFieldPhase(game, dennis)

    expect(game.actions.offerCubeCutterExchange).not.toHaveBeenCalled()
  })

  test('does not offer exchange when player lacks food', () => {
    const card = res.getCardById('cube-cutter-c098')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.food = 0
    game.actions = { offerCubeCutterExchange: jest.fn() }

    card.onFieldPhase(game, dennis)

    expect(game.actions.offerCubeCutterExchange).not.toHaveBeenCalled()
  })
})
