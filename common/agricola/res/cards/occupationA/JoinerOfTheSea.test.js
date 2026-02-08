const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Joiner of the Sea (OccA 159)', () => {
  test('offers trade when another player uses fishing', () => {
    const card = res.getCardById('joiner-of-the-sea-a159')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.wood = 1
    game.actions = { offerJoinerOfTheSeaTrade: jest.fn() }

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(game.actions.offerJoinerOfTheSeaTrade).toHaveBeenCalledWith(dennis, micah, card, 2)
  })

  test('offers trade for 3 food when another player uses reed bank', () => {
    const card = res.getCardById('joiner-of-the-sea-a159')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.wood = 1
    game.actions = { offerJoinerOfTheSeaTrade: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis)

    expect(game.actions.offerJoinerOfTheSeaTrade).toHaveBeenCalledWith(dennis, micah, card, 3)
  })

  test('does not trigger when card owner uses fishing', () => {
    const card = res.getCardById('joiner-of-the-sea-a159')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    game.actions = { offerJoinerOfTheSeaTrade: jest.fn() }

    card.onAnyAction(game, dennis, 'fishing', dennis)

    expect(game.actions.offerJoinerOfTheSeaTrade).not.toHaveBeenCalled()
  })

  test('does not trigger without wood', () => {
    const card = res.getCardById('joiner-of-the-sea-a159')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.wood = 0
    game.actions = { offerJoinerOfTheSeaTrade: jest.fn() }

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(game.actions.offerJoinerOfTheSeaTrade).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('joiner-of-the-sea-a159')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.wood = 1
    game.actions = { offerJoinerOfTheSeaTrade: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerJoinerOfTheSeaTrade).not.toHaveBeenCalled()
  })
})
