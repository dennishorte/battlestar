const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Building Expert (OccA 163)', () => {
  test('gives wood when using resource market with 1st person', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getPersonPlacedThisRound = () => 1

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.wood).toBe(1)
  })

  test('gives clay when using resource market with 2nd person', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    dennis.getPersonPlacedThisRound = () => 2

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.clay).toBe(1)
  })

  test('gives reed when using resource market with 3rd person', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getPersonPlacedThisRound = () => 3

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.reed).toBe(1)
  })

  test('gives stone when using resource market with 4th person', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.getPersonPlacedThisRound = () => 4

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.stone).toBe(1)
  })

  test('gives stone when using resource market with 5th person', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.stone = 0
    dennis.getPersonPlacedThisRound = () => 5

    card.onAction(game, dennis, 'resource-market')

    expect(dennis.stone).toBe(1)
  })

  test('does not trigger for non-resource-market actions', () => {
    const card = res.getCardById('building-expert-a163')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.getPersonPlacedThisRound = () => 1

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.wood).toBe(0)
  })
})
