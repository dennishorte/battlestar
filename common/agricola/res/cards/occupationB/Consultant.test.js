const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Consultant (B102)', () => {
  test('gives 2 grain in 1-player game', () => {
    const card = res.getCardById('consultant-b102')
    const game = t.fixture({ numPlayers: 1, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    game.players.count = jest.fn().mockReturnValue(1)

    card.onPlay(game, dennis)

    expect(dennis.grain).toBe(2)
  })

  test('gives 3 clay in 2-player game', () => {
    const card = res.getCardById('consultant-b102')
    const game = t.fixture({ numPlayers: 2, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    game.players.count = jest.fn().mockReturnValue(2)

    card.onPlay(game, dennis)

    expect(dennis.clay).toBe(3)
  })

  test('gives 2 reed in 3-player game', () => {
    const card = res.getCardById('consultant-b102')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.players.count = jest.fn().mockReturnValue(3)

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(2)
  })

  test('gives 2 sheep in 4-player game if can place animals', () => {
    const card = res.getCardById('consultant-b102')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    dennis.addAnimals = jest.fn()
    game.players.count = jest.fn().mockReturnValue(4)

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).toHaveBeenCalledWith('sheep', 2)
  })

  test('does not give sheep in 4-player game if cannot place animals', () => {
    const card = res.getCardById('consultant-b102')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(false)
    dennis.addAnimals = jest.fn()
    game.players.count = jest.fn().mockReturnValue(4)

    card.onPlay(game, dennis)

    expect(dennis.addAnimals).not.toHaveBeenCalled()
  })
})
