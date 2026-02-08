const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Groom (B089)', () => {
  test('gives 1 wood on play', () => {
    const card = res.getCardById('groom-b089')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('offers build stable at round start when living in stone house with wood', () => {
    const card = res.getCardById('groom-b089')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.wood = 2
    game.actions = { offerBuildStable: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerBuildStable).toHaveBeenCalledWith(dennis, card, { cost: { wood: 1 } })
  })

  test('does not offer stable when not in stone house', () => {
    const card = res.getCardById('groom-b089')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.wood = 2
    game.actions = { offerBuildStable: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerBuildStable).not.toHaveBeenCalled()
  })

  test('does not offer stable when no wood', () => {
    const card = res.getCardById('groom-b089')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.wood = 0
    game.actions = { offerBuildStable: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerBuildStable).not.toHaveBeenCalled()
  })
})
