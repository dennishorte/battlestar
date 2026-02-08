const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Seed Servant (E115)', () => {
  test('offers bake bread when using grain seeds action', () => {
    const card = res.getCardById('seed-servant-e115')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBakeBread = jest.fn()
    game.actions.offerBakeBread = offerBakeBread

    card.onAction(game, dennis, 'take-grain')

    expect(offerBakeBread).toHaveBeenCalledWith(dennis, card)
  })

  test('offers sow when using vegetable seeds action', () => {
    const card = res.getCardById('seed-servant-e115')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerSow = jest.fn()
    game.actions.offerSow = offerSow

    card.onAction(game, dennis, 'take-vegetables')

    expect(offerSow).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer anything for other actions', () => {
    const card = res.getCardById('seed-servant-e115')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerBakeBread = jest.fn()
    const offerSow = jest.fn()
    game.actions.offerBakeBread = offerBakeBread
    game.actions.offerSow = offerSow

    card.onAction(game, dennis, 'forest')

    expect(offerBakeBread).not.toHaveBeenCalled()
    expect(offerSow).not.toHaveBeenCalled()
  })
})
