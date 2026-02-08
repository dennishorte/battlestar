const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Small-scale Farmer (B118)', () => {
  test('gives 1 wood at round start when player has exactly 2 rooms', () => {
    const card = res.getCardById('small-scale-farmer-b118')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(2)

    card.onRoundStart(game, dennis)

    expect(dennis.wood).toBe(1)
  })

  test('does not give wood when more than 2 rooms', () => {
    const card = res.getCardById('small-scale-farmer-b118')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(3)

    card.onRoundStart(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('does not give wood when less than 2 rooms', () => {
    const card = res.getCardById('small-scale-farmer-b118')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getRoomCount = jest.fn().mockReturnValue(1)

    card.onRoundStart(game, dennis)

    expect(dennis.wood).toBe(0)
  })
})
