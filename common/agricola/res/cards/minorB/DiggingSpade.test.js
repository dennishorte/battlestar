const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Digging Spade (B051)', () => {
  test('gives food equal to boar count on take-clay', () => {
    const card = res.getCardById('digging-spade-b051')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalsInFarmyard = jest.fn().mockReturnValue(3)

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.getAnimalsInFarmyard).toHaveBeenCalledWith('boar')
    expect(dennis.food).toBe(3)
  })

  test('gives food on take-clay-2 action', () => {
    const card = res.getCardById('digging-spade-b051')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalsInFarmyard = jest.fn().mockReturnValue(2)

    card.onAction(game, dennis, 'take-clay-2')

    expect(dennis.food).toBe(2)
  })

  test('does not give food when no boar', () => {
    const card = res.getCardById('digging-spade-b051')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalsInFarmyard = jest.fn().mockReturnValue(0)

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.food).toBe(0)
  })

  test('does not trigger on non-clay actions', () => {
    const card = res.getCardById('digging-spade-b051')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getAnimalsInFarmyard = jest.fn().mockReturnValue(5)

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.food).toBe(0)
  })

  test('requires min round 7', () => {
    const card = res.getCardById('digging-spade-b051')
    expect(card.prereqs.minRound).toBe(7)
  })
})
