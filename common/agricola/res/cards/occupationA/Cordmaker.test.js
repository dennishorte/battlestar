const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Cordmaker (OccA 142)', () => {
  test('offers choice when any player takes at least 2 reed', () => {
    const card = res.getCardById('cordmaker-a142')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerCordmakerChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis, { reed: 2 })

    expect(game.actions.offerCordmakerChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('offers choice when card owner takes at least 2 reed', () => {
    const card = res.getCardById('cordmaker-a142')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCordmakerChoice: jest.fn() }

    card.onAnyAction(game, dennis, 'take-reed', dennis, { reed: 3 })

    expect(game.actions.offerCordmakerChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when taking only 1 reed', () => {
    const card = res.getCardById('cordmaker-a142')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerCordmakerChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-reed', dennis, { reed: 1 })

    expect(game.actions.offerCordmakerChoice).not.toHaveBeenCalled()
  })

  test('does not trigger for non-reed actions', () => {
    const card = res.getCardById('cordmaker-a142')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCordmakerChoice: jest.fn() }

    card.onAnyAction(game, dennis, 'take-wood', dennis, { wood: 3 })

    expect(game.actions.offerCordmakerChoice).not.toHaveBeenCalled()
  })
})
