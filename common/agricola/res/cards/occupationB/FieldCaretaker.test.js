const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Field Caretaker (B141)', () => {
  test('adds virtual field on play', () => {
    const card = res.getCardById('field-caretaker-b141')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.addVirtualField = jest.fn()
    game.actions = { offerFieldCaretakerExchange: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.addVirtualField).toHaveBeenCalledWith({
      cardId: 'field-caretaker-b141',
      label: 'Field Caretaker',
      cropRestriction: null,
    })
  })

  test('offers clay to grain exchange on play', () => {
    const card = res.getCardById('field-caretaker-b141')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.addVirtualField = jest.fn()
    game.actions = { offerFieldCaretakerExchange: jest.fn() }

    card.onPlay(game, dennis)

    expect(game.actions.offerFieldCaretakerExchange).toHaveBeenCalledWith(dennis, card)
  })

  test('has isField flag', () => {
    const card = res.getCardById('field-caretaker-b141')
    expect(card.isField).toBe(true)
  })
})
