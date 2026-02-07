const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Inn (B042)', () => {
  test('provides action space', () => {
    const card = res.getCardById('forest-inn-b042')
    expect(card.providesActionSpace).toBe(true)
    expect(card.actionSpaceId).toBe('forest-inn')
  })

  test('owner does not pay when using', () => {
    const card = res.getCardById('forest-inn-b042')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    game.actions.forestInnExchange = jest.fn()

    card.onActionSpaceUsed(game, dennis, dennis)

    expect(dennis.food).toBe(5) // No change
    expect(game.actions.forestInnExchange).toHaveBeenCalledWith(dennis, card)
  })

  test('other player pays 1 food to owner', () => {
    const card = res.getCardById('forest-inn-b042')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3
    game.actions.forestInnExchange = jest.fn()

    card.onActionSpaceUsed(game, micah, dennis)

    expect(micah.food).toBe(2)
    expect(dennis.food).toBe(1)
    expect(game.actions.forestInnExchange).toHaveBeenCalledWith(micah, card)
  })

  test('other player without food still uses action', () => {
    const card = res.getCardById('forest-inn-b042')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 0
    game.actions.forestInnExchange = jest.fn()

    card.onActionSpaceUsed(game, micah, dennis)

    expect(micah.food).toBe(0)
    expect(dennis.food).toBe(0)
    expect(game.actions.forestInnExchange).toHaveBeenCalledWith(micah, card)
  })

  test('has 1 VP', () => {
    const card = res.getCardById('forest-inn-b042')
    expect(card.vps).toBe(1)
  })

  test('requires max round 6', () => {
    const card = res.getCardById('forest-inn-b042')
    expect(card.prereqs.maxRound).toBe(6)
  })
})
