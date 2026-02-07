const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Credit (A054)', () => {
  test('gives 5 food on play and activates credit', () => {
    const card = res.getCardById('credit-a054')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(5)
    expect(dennis.creditActive).toBe(true)
  })

  test('deducts 1 food at end of non-harvest round', () => {
    const card = res.getCardById('credit-a054')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.creditActive = true
    dennis.food = 3
    game.isHarvestRound = () => false

    card.onRoundEnd(game, dennis, 2)

    expect(dennis.food).toBe(2)
  })

  test('gives begging marker if no food at end of non-harvest round', () => {
    const card = res.getCardById('credit-a054')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.creditActive = true
    dennis.food = 0
    dennis.beggingMarkers = 0
    game.isHarvestRound = () => false

    card.onRoundEnd(game, dennis, 2)

    expect(dennis.beggingMarkers).toBe(1)
  })

  test('does not deduct food during harvest rounds', () => {
    const card = res.getCardById('credit-a054')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.creditActive = true
    dennis.food = 3
    game.isHarvestRound = () => true

    card.onRoundEnd(game, dennis, 4)

    expect(dennis.food).toBe(3)
  })

  test('does not deduct food if credit not active', () => {
    const card = res.getCardById('credit-a054')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.creditActive = false
    dennis.food = 3
    game.isHarvestRound = () => false

    card.onRoundEnd(game, dennis, 2)

    expect(dennis.food).toBe(3)
  })
})
