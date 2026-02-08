const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Harpooner (OccA 138)', () => {
  test('offers bonus when fishing with wood', () => {
    const card = res.getCardById('harpooner-a138')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerHarpoonerBonus: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerHarpoonerBonus).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer bonus when fishing without wood', () => {
    const card = res.getCardById('harpooner-a138')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.actions = { offerHarpoonerBonus: jest.fn() }

    card.onAction(game, dennis, 'fishing')

    expect(game.actions.offerHarpoonerBonus).not.toHaveBeenCalled()
  })

  test('does not trigger for non-fishing actions', () => {
    const card = res.getCardById('harpooner-a138')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 5
    game.actions = { offerHarpoonerBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerHarpoonerBonus).not.toHaveBeenCalled()
  })
})
