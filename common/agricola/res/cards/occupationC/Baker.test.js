const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Baker (C107)', () => {
  test('offers bake bread action on play', () => {
    const card = res.getCardById('baker-c107')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('offers bake bread action at feeding phase start', () => {
    const card = res.getCardById('baker-c107')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBakeBread: jest.fn() }

    card.onFeedingPhaseStart(game, dennis)

    expect(game.actions.offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })
})
