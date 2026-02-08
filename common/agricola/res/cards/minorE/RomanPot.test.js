const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Roman Pot (E056)', () => {
  test('stores 4 food on play', () => {
    const card = res.getCardById('roman-pot-e056')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.stored).toBe(4)
  })

  test('gives 1 food at work phase start if last in turn order', () => {
    const card = res.getCardById('roman-pot-e056')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 3

    game.isLastInTurnOrder = () => true

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.food).toBe(1)
    expect(card.stored).toBe(2)
  })

  test('does not give food if not last in turn order', () => {
    const card = res.getCardById('roman-pot-e056')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 3

    game.isLastInTurnOrder = () => false

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.food).toBe(0)
    expect(card.stored).toBe(3)
  })

  test('does not give food if nothing stored', () => {
    const card = res.getCardById('roman-pot-e056')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.stored = 0

    game.isLastInTurnOrder = () => true

    card.onWorkPhaseStart(game, dennis)

    expect(dennis.food).toBe(0)
    expect(card.stored).toBe(0)
  })
})
