const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Midwife (OccD 160)', () => {
  test('gives 1 grain when another player takes family growth with first person', () => {
    const card = res.getCardById('midwife-d160')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0
    micah.getPersonPlacedThisRound = () => 1

    card.onAnyAction(game, micah, 'family-growth', dennis)

    expect(dennis.grain).toBe(1)
  })

  test('gives 1 grain when another player takes urgent family growth with first person', () => {
    const card = res.getCardById('midwife-d160')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0
    micah.getPersonPlacedThisRound = () => 1

    card.onAnyAction(game, micah, 'family-growth-urgent', dennis)

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain when another player uses second person', () => {
    const card = res.getCardById('midwife-d160')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0
    micah.getPersonPlacedThisRound = () => 2

    card.onAnyAction(game, micah, 'family-growth', dennis)

    expect(dennis.grain).toBe(0)
  })

  test('does not give grain when card owner takes family growth', () => {
    const card = res.getCardById('midwife-d160')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0
    dennis.getPersonPlacedThisRound = () => 1

    card.onAnyAction(game, dennis, 'family-growth', dennis)

    expect(dennis.grain).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('midwife-d160')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.grain = 0
    micah.getPersonPlacedThisRound = () => 1

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.grain).toBe(0)
  })
})
