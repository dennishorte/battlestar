const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Illusionist (B146)', () => {
  test('offers bonus when using building resource accumulation space with cards in hand', () => {
    const card = res.getCardById('illusionist-b146')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.hand = ['card-1', 'card-2']
    game.isBuildingResourceAccumulationSpace = jest.fn().mockReturnValue(true)
    game.actions = { offerIllusionistBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerIllusionistBonus).toHaveBeenCalledWith(dennis, card, 'take-wood')
  })

  test('does not offer when hand is empty', () => {
    const card = res.getCardById('illusionist-b146')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    t.setBoard(game, {
      dennis: {
        hand: [],
      },
    })
    game.run()

    const dennis = t.player(game)
    game.isBuildingResourceAccumulationSpace = jest.fn().mockReturnValue(true)
    game.actions = { offerIllusionistBonus: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerIllusionistBonus).not.toHaveBeenCalled()
  })

  test('does not offer for non-building resource spaces', () => {
    const card = res.getCardById('illusionist-b146')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.hand = ['card-1']
    game.isBuildingResourceAccumulationSpace = jest.fn().mockReturnValue(false)
    game.actions = { offerIllusionistBonus: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerIllusionistBonus).not.toHaveBeenCalled()
  })
})
