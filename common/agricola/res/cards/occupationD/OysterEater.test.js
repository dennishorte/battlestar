const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Oyster Eater (OccD 134)', () => {
  test('gives 1 bonus point and sets skip flag when fishing is used', () => {
    const card = res.getCardById('oyster-eater-d134')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.bonusPoints = 0
    dennis.skipNextPersonPlacement = false

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(dennis.bonusPoints).toBe(1)
    expect(dennis.skipNextPersonPlacement).toBe(true)
  })

  test('triggers when card owner uses fishing', () => {
    const card = res.getCardById('oyster-eater-d134')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0
    dennis.skipNextPersonPlacement = false

    card.onAnyAction(game, dennis, 'fishing', dennis)

    expect(dennis.bonusPoints).toBe(1)
    expect(dennis.skipNextPersonPlacement).toBe(true)
  })

  test('accumulates bonus points over multiple uses', () => {
    const card = res.getCardById('oyster-eater-d134')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.bonusPoints = 2
    dennis.skipNextPersonPlacement = false

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(dennis.bonusPoints).toBe(3)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('oyster-eater-d134')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.bonusPoints = 0
    dennis.skipNextPersonPlacement = false

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.bonusPoints).toBe(0)
    expect(dennis.skipNextPersonPlacement).toBe(false)
  })
})
