const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Task Artisan (OccA 096)', () => {
  test('gives 1 wood and minor improvement action on play', () => {
    const card = res.getCardById('task-artisan-a096')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerMinorImprovementAction: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(game.actions.offerMinorImprovementAction).toHaveBeenCalledWith(dennis, card)
  })

  test('gives 1 wood and minor improvement action when stone action revealed', () => {
    const card = res.getCardById('task-artisan-a096')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerMinorImprovementAction: jest.fn() }

    card.onStoneActionRevealed(game, dennis)

    expect(dennis.wood).toBe(1)
    expect(game.actions.offerMinorImprovementAction).toHaveBeenCalledWith(dennis, card)
  })
})
