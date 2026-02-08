const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Puppeteer (C152)', () => {
  test('offers occupation when another player uses traveling-players', () => {
    const card = res.getCardById('puppeteer-c152')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 2
    game.actions = { offerPuppeteerOccupation: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerPuppeteerOccupation).toHaveBeenCalledWith(dennis, micah, card)
  })

  test('does not trigger when card owner uses traveling-players', () => {
    const card = res.getCardById('puppeteer-c152')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.actions = { offerPuppeteerOccupation: jest.fn() }

    card.onAnyAction(game, dennis, 'traveling-players', dennis)

    expect(game.actions.offerPuppeteerOccupation).not.toHaveBeenCalled()
  })

  test('does not trigger when card owner lacks food', () => {
    const card = res.getCardById('puppeteer-c152')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    game.actions = { offerPuppeteerOccupation: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerPuppeteerOccupation).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('puppeteer-c152')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 5
    game.actions = { offerPuppeteerOccupation: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerPuppeteerOccupation).not.toHaveBeenCalled()
  })
})
