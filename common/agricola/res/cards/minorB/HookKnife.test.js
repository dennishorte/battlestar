const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Hook Knife (B035)', () => {
  test('sets hookKnifeActive flag on play', () => {
    const card = res.getCardById('hook-knife-b035')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(dennis.hookKnifeActive).toBe(true)
  })

  test('gives 2 bonus points when sheep threshold reached in 2 player game', () => {
    const card = res.getCardById('hook-knife-b035')
    const game = t.fixture({ cardSets: ['minorB'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game)
    dennis.hookKnifeActive = true
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = jest.fn().mockReturnValue(8)

    card.checkTrigger(game, dennis)

    expect(dennis.hookKnifeActive).toBe(false)
    expect(dennis.bonusPoints).toBe(2)
  })

  test('gives 2 bonus points when sheep threshold reached in 4 player game', () => {
    const card = res.getCardById('hook-knife-b035')
    const game = t.fixture({ cardSets: ['minorB'], numPlayers: 4 })
    game.run()

    const dennis = t.player(game)
    dennis.hookKnifeActive = true
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = jest.fn().mockReturnValue(6)

    card.checkTrigger(game, dennis)

    expect(dennis.hookKnifeActive).toBe(false)
    expect(dennis.bonusPoints).toBe(2)
  })

  test('does not trigger when below threshold', () => {
    const card = res.getCardById('hook-knife-b035')
    const game = t.fixture({ cardSets: ['minorB'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game)
    dennis.hookKnifeActive = true
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = jest.fn().mockReturnValue(7)

    card.checkTrigger(game, dennis)

    expect(dennis.hookKnifeActive).toBe(true)
    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger when already used', () => {
    const card = res.getCardById('hook-knife-b035')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.hookKnifeActive = false
    dennis.bonusPoints = 0
    dennis.getTotalAnimals = jest.fn().mockReturnValue(10)

    card.checkTrigger(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('hook-knife-b035')
    expect(card.cost).toEqual({ wood: 1 })
  })
})
