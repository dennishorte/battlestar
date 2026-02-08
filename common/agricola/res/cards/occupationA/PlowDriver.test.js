const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Plow Driver (OccA 090)', () => {
  test('offers plow for food at round start in stone house with food', () => {
    const card = res.getCardById('plow-driver-a090')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.food = 1
    game.getAnytimeFoodConversionOptions = () => []
    game.offerPlowForFood = jest.fn()

    card.onRoundStart(game, dennis)

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer in wooden house', () => {
    const card = res.getCardById('plow-driver-a090')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    dennis.food = 5
    game.getAnytimeFoodConversionOptions = () => []
    game.offerPlowForFood = jest.fn()

    card.onRoundStart(game, dennis)

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not offer in clay house', () => {
    const card = res.getCardById('plow-driver-a090')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    dennis.food = 5
    game.getAnytimeFoodConversionOptions = () => []
    game.offerPlowForFood = jest.fn()

    card.onRoundStart(game, dennis)

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('does not offer without food or conversion options', () => {
    const card = res.getCardById('plow-driver-a090')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.food = 0
    game.getAnytimeFoodConversionOptions = () => []
    game.offerPlowForFood = jest.fn()

    card.onRoundStart(game, dennis)

    expect(game.offerPlowForFood).not.toHaveBeenCalled()
  })

  test('offers with food conversion options available', () => {
    const card = res.getCardById('plow-driver-a090')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    dennis.food = 0
    game.getAnytimeFoodConversionOptions = () => [{ id: 'conversion' }]
    game.offerPlowForFood = jest.fn()

    card.onRoundStart(game, dennis)

    expect(game.offerPlowForFood).toHaveBeenCalledWith(dennis, card)
  })
})
