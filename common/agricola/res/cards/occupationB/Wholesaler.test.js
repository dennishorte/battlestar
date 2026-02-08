const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Wholesaler (B137)', () => {
  test('sets up goods on play', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.goods[8]).toBe('vegetables')
    expect(card.goods[9]).toBe('boar')
    expect(card.goods[10]).toBe('stone')
    expect(card.goods[11]).toBe('cattle')
  })

  test('gives vegetable when using round 8 action space', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    card.onPlay(game, dennis)
    game.getActionSpaceRound = jest.fn().mockReturnValue(8)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.vegetables).toBe(1)
    expect(card.goods[8]).toBeUndefined()
  })

  test('gives boar when using round 9 action space if can place', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)
    game.getActionSpaceRound = jest.fn().mockReturnValue(9)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()

    card.onAction(game, dennis, 'some-action')

    expect(dennis.addAnimals).toHaveBeenCalledWith('boar', 1)
    expect(card.goods[9]).toBeUndefined()
  })

  test('gives stone when using round 10 action space', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    card.onPlay(game, dennis)
    game.getActionSpaceRound = jest.fn().mockReturnValue(10)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.stone).toBe(1)
    expect(card.goods[10]).toBeUndefined()
  })

  test('gives cattle when using round 11 action space if can place', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)
    game.getActionSpaceRound = jest.fn().mockReturnValue(11)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()

    card.onAction(game, dennis, 'some-action')

    expect(dennis.addAnimals).toHaveBeenCalledWith('cattle', 1)
    expect(card.goods[11]).toBeUndefined()
  })

  test('does not give goods for other rounds', () => {
    const card = res.getCardById('wholesaler-b137')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.vegetables = 0
    dennis.stone = 0
    card.onPlay(game, dennis)
    game.getActionSpaceRound = jest.fn().mockReturnValue(5)

    card.onAction(game, dennis, 'some-action')

    expect(dennis.vegetables).toBe(0)
    expect(dennis.stone).toBe(0)
  })
})
