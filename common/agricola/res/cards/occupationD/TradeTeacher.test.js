const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Trade Teacher (OccD 137)', () => {
  test('offers purchase when using lessons-1', () => {
    const card = res.getCardById('trade-teacher-d137')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerTradeTeacherPurchase: jest.fn() }

    card.onAction(game, dennis, 'lessons-1')

    expect(game.actions.offerTradeTeacherPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('offers purchase when using lessons-2', () => {
    const card = res.getCardById('trade-teacher-d137')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerTradeTeacherPurchase: jest.fn() }

    card.onAction(game, dennis, 'lessons-2')

    expect(game.actions.offerTradeTeacherPurchase).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('trade-teacher-d137')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerTradeTeacherPurchase: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerTradeTeacherPurchase).not.toHaveBeenCalled()
  })
})
