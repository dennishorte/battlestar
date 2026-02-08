const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Basket Weaver (C095)', () => {
  test('builds basketmakers workshop when player has required resources', () => {
    const card = res.getCardById('basket-weaver-c095')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2
    dennis.reed = 2
    game.actions = { buildMajorImprovement: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.buildMajorImprovement).toHaveBeenCalledWith(
      dennis,
      'basketmakers-workshop',
      { stone: 1, reed: 1 }
    )
  })

  test('does not build when player lacks stone', () => {
    const card = res.getCardById('basket-weaver-c095')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.reed = 2
    game.actions = { buildMajorImprovement: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.buildMajorImprovement).not.toHaveBeenCalled()
  })

  test('does not build when player lacks reed', () => {
    const card = res.getCardById('basket-weaver-c095')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 2
    dennis.reed = 0
    game.actions = { buildMajorImprovement: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.buildMajorImprovement).not.toHaveBeenCalled()
  })
})
