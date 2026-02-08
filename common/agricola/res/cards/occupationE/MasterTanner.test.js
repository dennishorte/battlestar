const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Master Tanner (E085)', () => {
  test('initializes food to 0 and providesRoom to false on play', () => {
    const card = res.getCardById('master-tanner-e085')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.food).toBe(0)
    expect(card.providesRoom).toBe(false)
  })

  test('places food on card when converting boar to food', () => {
    const card = res.getCardById('master-tanner-e085')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.food = 0

    const dennis = t.player(game)
    dennis.getRoomCount = () => 2

    card.onConvertAnimalToFood(game, dennis, 'boar')

    expect(card.food).toBe(1)
  })

  test('places food on card when converting cattle to food', () => {
    const card = res.getCardById('master-tanner-e085')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.food = 0

    const dennis = t.player(game)
    dennis.getRoomCount = () => 2

    card.onConvertAnimalToFood(game, dennis, 'cattle')

    expect(card.food).toBe(1)
  })

  test('does not place food when converting sheep to food', () => {
    const card = res.getCardById('master-tanner-e085')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.food = 0

    const dennis = t.player(game)
    dennis.getRoomCount = () => 2

    card.onConvertAnimalToFood(game, dennis, 'sheep')

    expect(card.food).toBe(0)
  })

  test('provides room when food equals room count', () => {
    const card = res.getCardById('master-tanner-e085')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.food = 1

    const dennis = t.player(game)
    dennis.getRoomCount = () => 2

    card.onConvertAnimalToFood(game, dennis, 'boar')

    expect(card.food).toBe(2)
    expect(card.providesRoom).toBe(true)
  })

  test('checkRoom sets providesRoom based on food and room count', () => {
    const card = res.getCardById('master-tanner-e085')

    card.food = 3

    const mockPlayer = {
      getRoomCount: () => 3,
    }

    card.checkRoom(mockPlayer)

    expect(card.providesRoom).toBe(true)
  })

  test('checkRoom sets providesRoom to false when food does not equal room count', () => {
    const card = res.getCardById('master-tanner-e085')

    card.food = 2

    const mockPlayer = {
      getRoomCount: () => 3,
    }

    card.checkRoom(mockPlayer)

    expect(card.providesRoom).toBe(false)
  })
})
