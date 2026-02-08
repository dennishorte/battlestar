const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Market Master (E131)', () => {
  test('offers occupation when using traveling players with last person', () => {
    const card = res.getCardById('market-master-e131')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.players.count = () => 2

    const dennis = t.player(game)
    dennis.isLastPersonPlaced = () => true

    const offerPlayOccupation = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation

    card.onAction(game, dennis, 'traveling-players')

    expect(offerPlayOccupation).toHaveBeenCalledWith(dennis, card, { cost: { food: 1 } })
  })

  test('offers occupation when using resource market with last person in 3-player game', () => {
    const card = res.getCardById('market-master-e131')
    const game = t.fixture({ cardSets: ['occupationE'], numPlayers: 3 })
    game.run()

    game.players.count = () => 3

    const dennis = t.player(game)
    dennis.isLastPersonPlaced = () => true

    const offerPlayOccupation = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation

    card.onAction(game, dennis, 'resource-market')

    expect(offerPlayOccupation).toHaveBeenCalledWith(dennis, card, { cost: { food: 1 } })
  })

  test('does not offer occupation when not last person placed', () => {
    const card = res.getCardById('market-master-e131')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.players.count = () => 2

    const dennis = t.player(game)
    dennis.isLastPersonPlaced = () => false

    const offerPlayOccupation = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation

    card.onAction(game, dennis, 'traveling-players')

    expect(offerPlayOccupation).not.toHaveBeenCalled()
  })

  test('does not offer occupation for wrong action space', () => {
    const card = res.getCardById('market-master-e131')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    game.players.count = () => 2

    const dennis = t.player(game)
    dennis.isLastPersonPlaced = () => true

    const offerPlayOccupation = jest.fn()
    game.actions.offerPlayOccupation = offerPlayOccupation

    card.onAction(game, dennis, 'forest')

    expect(offerPlayOccupation).not.toHaveBeenCalled()
  })
})
