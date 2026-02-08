const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Case Builder (B105)', () => {
  test('gives 1 of each resource if player has at least 2', () => {
    const card = res.getCardById('case-builder-b105')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.grain = 3
    dennis.vegetables = 2
    dennis.reed = 2
    dennis.wood = 5

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(3)
    expect(dennis.grain).toBe(4)
    expect(dennis.vegetables).toBe(3)
    expect(dennis.reed).toBe(3)
    expect(dennis.wood).toBe(6)
  })

  test('does not give resources if player has less than 2', () => {
    const card = res.getCardById('case-builder-b105')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.grain = 0
    dennis.vegetables = 1
    dennis.reed = 0
    dennis.wood = 1

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
    expect(dennis.grain).toBe(0)
    expect(dennis.vegetables).toBe(1)
    expect(dennis.reed).toBe(0)
    expect(dennis.wood).toBe(1)
  })

  test('gives resources only for those with at least 2', () => {
    const card = res.getCardById('case-builder-b105')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    dennis.grain = 1
    dennis.vegetables = 2
    dennis.reed = 0
    dennis.wood = 3

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(3)
    expect(dennis.grain).toBe(1)
    expect(dennis.vegetables).toBe(3)
    expect(dennis.reed).toBe(0)
    expect(dennis.wood).toBe(4)
  })
})
