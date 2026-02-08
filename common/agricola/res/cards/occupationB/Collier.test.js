const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Collier (B144)', () => {
  test('gives 1 reed and 1 wood when using Clay Pit', () => {
    const card = res.getCardById('collier-b144')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.wood = 0
    game.addToAccumulationSpace = jest.fn()
    game.players.count = jest.fn().mockReturnValue(3)

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.reed).toBe(1)
    expect(dennis.wood).toBe(1)
  })

  test('adds 1 wood to Hollow in 3+ player game', () => {
    const card = res.getCardById('collier-b144')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.wood = 0
    game.addToAccumulationSpace = jest.fn()
    game.players.count = jest.fn().mockReturnValue(3)

    card.onAction(game, dennis, 'take-clay')

    expect(game.addToAccumulationSpace).toHaveBeenCalledWith('take-clay-2', 'wood', 1)
  })

  test('does not add wood to Hollow in 2 player game', () => {
    const card = res.getCardById('collier-b144')
    const game = t.fixture({ numPlayers: 2, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.wood = 0
    game.addToAccumulationSpace = jest.fn()
    game.players.count = jest.fn().mockReturnValue(2)

    card.onAction(game, dennis, 'take-clay')

    expect(game.addToAccumulationSpace).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('collier-b144')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.wood = 0
    game.addToAccumulationSpace = jest.fn()

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.reed).toBe(0)
    expect(dennis.wood).toBe(0)
  })
})
