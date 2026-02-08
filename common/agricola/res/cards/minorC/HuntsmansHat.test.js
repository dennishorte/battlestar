const t = require('../../../testutil.js')
const res = require('../../index.js')

describe("Huntsman's Hat (C052)", () => {
  test('has onGainBoar hook', () => {
    const card = res.getCardById('huntsmans-hat-c052')
    expect(card.onGainBoar).toBeDefined()
  })

  test('gives food equal to boar count from action space', () => {
    const card = res.getCardById('huntsmans-hat-c052')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onGainBoar(game, dennis, 3, true)

    expect(dennis.food).toBe(3)
  })

  test('does not give food when boar not from action space', () => {
    const card = res.getCardById('huntsmans-hat-c052')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onGainBoar(game, dennis, 2, false)

    expect(dennis.food).toBe(0)
  })

  test('does not give food when count is 0', () => {
    const card = res.getCardById('huntsmans-hat-c052')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onGainBoar(game, dennis, 0, true)

    expect(dennis.food).toBe(0)
  })
})
