const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stable Sergeant (B167)', () => {
  test('offers animals when player has food and can place all three', () => {
    const card = res.getCardById('stable-sergeant-b167')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerStableSergeantAnimals: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerStableSergeantAnimals).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when less than 2 food', () => {
    const card = res.getCardById('stable-sergeant-b167')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 1
    dennis.canPlaceAnimals = jest.fn().mockReturnValue(true)
    game.actions = { offerStableSergeantAnimals: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerStableSergeantAnimals).not.toHaveBeenCalled()
  })

  test('does not offer when cannot place all animals', () => {
    const card = res.getCardById('stable-sergeant-b167')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    dennis.canPlaceAnimals = jest.fn((type) => type !== 'cattle')
    game.actions = { offerStableSergeantAnimals: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerStableSergeantAnimals).not.toHaveBeenCalled()
  })
})
