const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stable Master (C089)', () => {
  test('offers to build stable on play when player has wood', () => {
    const card = res.getCardById('stable-master-c089')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 2
    game.actions = { offerBuildStable: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuildStable).toHaveBeenCalledWith(
      dennis,
      card,
      { cost: { wood: 1 } }
    )
  })

  test('does not offer stable build when player lacks wood', () => {
    const card = res.getCardById('stable-master-c089')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerBuildStable: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBuildStable).not.toHaveBeenCalled()
  })

  test('first unfenced stable holds 3 animals', () => {
    const card = res.getCardById('stable-master-c089')

    const mockPlayer = {}
    expect(card.modifyUnfencedStableCapacity(mockPlayer, 0)).toBe(3)
  })

  test('other unfenced stables hold 1 animal', () => {
    const card = res.getCardById('stable-master-c089')

    const mockPlayer = {}
    expect(card.modifyUnfencedStableCapacity(mockPlayer, 1)).toBe(1)
    expect(card.modifyUnfencedStableCapacity(mockPlayer, 2)).toBe(1)
  })
})
