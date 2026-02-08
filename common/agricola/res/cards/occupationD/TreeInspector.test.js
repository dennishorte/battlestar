const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Tree Inspector (OccD 116)', () => {
  test('initializes wood counter to 0 on play', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.wood).toBe(0)
  })

  test('adds 1 wood on round start', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.wood = 3

    card.onRoundStart(game, dennis)

    expect(card.wood).toBe(4)
  })

  test('handles undefined wood on round start', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.wood = undefined

    card.onRoundStart(game, dennis)

    expect(card.wood).toBe(1)
  })

  test('resets wood to 0 when quarry card is revealed', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.wood = 5

    card.onRevealRoundCard(game, dennis, { isQuarry: true })

    expect(card.wood).toBe(0)
  })

  test('does not reset wood when non-quarry card is revealed', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.wood = 5

    card.onRevealRoundCard(game, dennis, { isQuarry: false })

    expect(card.wood).toBe(5)
  })

  test('takeWood gives all accumulated wood to player', () => {
    const card = res.getCardById('tree-inspector-d116')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    card.wood = 4

    card.takeWood(game, dennis)

    expect(dennis.wood).toBe(4)
    expect(card.wood).toBe(0)
  })

  test('has isAccumulationSpace flag', () => {
    const card = res.getCardById('tree-inspector-d116')
    expect(card.isAccumulationSpace).toBe(true)
  })

  test('has accumulationForOwnerOnly flag', () => {
    const card = res.getCardById('tree-inspector-d116')
    expect(card.accumulationForOwnerOnly).toBe(true)
  })
})
