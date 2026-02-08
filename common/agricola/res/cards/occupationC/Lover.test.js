const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lover (C127)', () => {
  test('pays food and triggers family growth when player has enough food', () => {
    const card = res.getCardById('lover-c127')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 10
    dennis.removeResource = jest.fn()
    game.state = { round: 6 } // 14 - 6 = 8 rounds left
    game.actions = { familyGrowthWithoutRoom: jest.fn() }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.removeResource).toHaveBeenCalledWith('food', 8)
    expect(game.actions.familyGrowthWithoutRoom).toHaveBeenCalledWith(dennis)
  })

  test('does not trigger when player lacks food', () => {
    const card = res.getCardById('lover-c127')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    dennis.removeResource = jest.fn()
    game.state = { round: 6 } // 14 - 6 = 8 rounds left
    game.actions = { familyGrowthWithoutRoom: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.removeResource).not.toHaveBeenCalled()
    expect(game.actions.familyGrowthWithoutRoom).not.toHaveBeenCalled()
  })

  test('costs less food when played later in game', () => {
    const card = res.getCardById('lover-c127')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 5
    dennis.removeResource = jest.fn()
    game.state = { round: 12 } // 14 - 12 = 2 rounds left
    game.actions = { familyGrowthWithoutRoom: jest.fn() }
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.removeResource).toHaveBeenCalledWith('food', 2)
    expect(game.actions.familyGrowthWithoutRoom).toHaveBeenCalledWith(dennis)
  })
})
