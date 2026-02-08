const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Childless (B114)', () => {
  test('gives food and offers crop choice when player has 3+ rooms and 2 people', () => {
    const card = res.getCardById('childless-b114')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(3)
    dennis.getFamilySize = jest.fn().mockReturnValue(2)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(1)
    expect(game.actions.offerResourceChoice).toHaveBeenCalledWith(dennis, card, ['grain', 'vegetables'])
  })

  test('does not trigger when less than 3 rooms', () => {
    const card = res.getCardById('childless-b114')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(2)
    dennis.getFamilySize = jest.fn().mockReturnValue(2)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(0)
    expect(game.actions.offerResourceChoice).not.toHaveBeenCalled()
  })

  test('does not trigger when more than 2 people', () => {
    const card = res.getCardById('childless-b114')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(3)
    dennis.getFamilySize = jest.fn().mockReturnValue(3)
    game.actions = { offerResourceChoice: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(dennis.food).toBe(0)
    expect(game.actions.offerResourceChoice).not.toHaveBeenCalled()
  })
})
