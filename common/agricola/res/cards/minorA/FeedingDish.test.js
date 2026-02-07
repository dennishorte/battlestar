const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Feeding Dish (A066)', () => {
  test('gives grain when taking sheep and already have sheep', () => {
    const card = res.getCardById('feeding-dish-a066')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getTotalAnimals = (type) => type === 'sheep' ? 2 : 0

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.grain).toBe(1)
  })

  test('gives grain when taking boar and already have boar', () => {
    const card = res.getCardById('feeding-dish-a066')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getTotalAnimals = (type) => type === 'boar' ? 1 : 0

    card.onAction(game, dennis, 'take-boar')

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain when taking sheep but have none', () => {
    const card = res.getCardById('feeding-dish-a066')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getTotalAnimals = () => 0

    card.onAction(game, dennis, 'take-sheep')

    expect(dennis.grain).toBe(0)
  })

  test('does not trigger on non-animal actions', () => {
    const card = res.getCardById('feeding-dish-a066')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getTotalAnimals = () => 5

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.grain).toBe(0)
  })
})
