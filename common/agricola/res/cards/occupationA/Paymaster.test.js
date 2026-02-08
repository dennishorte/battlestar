const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Paymaster (OccA 154)', () => {
  test('offers bonus when another player uses food accumulation space', () => {
    const card = res.getCardById('paymaster-a154')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.grain = 1
    game.isFoodAccumulationSpace = () => true
    game.actions = { offerPaymasterBonus: jest.fn() }

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(game.actions.offerPaymasterBonus).toHaveBeenCalledWith(dennis, micah, card)
  })

  test('does not trigger when card owner uses food accumulation space', () => {
    const card = res.getCardById('paymaster-a154')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 1
    game.isFoodAccumulationSpace = () => true
    game.actions = { offerPaymasterBonus: jest.fn() }

    card.onAnyAction(game, dennis, 'fishing', dennis)

    expect(game.actions.offerPaymasterBonus).not.toHaveBeenCalled()
  })

  test('does not trigger without grain', () => {
    const card = res.getCardById('paymaster-a154')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.grain = 0
    game.isFoodAccumulationSpace = () => true
    game.actions = { offerPaymasterBonus: jest.fn() }

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(game.actions.offerPaymasterBonus).not.toHaveBeenCalled()
  })

  test('does not trigger for non-food accumulation spaces', () => {
    const card = res.getCardById('paymaster-a154')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.grain = 1
    game.isFoodAccumulationSpace = () => false
    game.actions = { offerPaymasterBonus: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerPaymasterBonus).not.toHaveBeenCalled()
  })
})
