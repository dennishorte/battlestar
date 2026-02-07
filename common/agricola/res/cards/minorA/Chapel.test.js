const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Chapel (A039)', () => {
  test('provides action space', () => {
    const card = res.getCardById('chapel-a039')
    expect(card.providesActionSpace).toBe(true)
    expect(card.actionSpaceId).toBe('chapel')
  })

  test('gives 3 bonus points when owner uses it', () => {
    const card = res.getCardById('chapel-a039')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.onActionSpaceUsed(game, dennis, dennis)

    expect(dennis.bonusPoints).toBe(3)
  })

  test('takes grain from other player and gives bonus points', () => {
    const card = res.getCardById('chapel-a039')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    dennis.grain = 0
    micah.grain = 2
    micah.bonusPoints = 0

    card.onActionSpaceUsed(game, micah, dennis)

    expect(micah.grain).toBe(1)
    expect(dennis.grain).toBe(1)
    expect(micah.bonusPoints).toBe(3)
  })

  test('still gives bonus points if other player has no grain', () => {
    const card = res.getCardById('chapel-a039')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    micah.grain = 0
    micah.bonusPoints = 0

    card.onActionSpaceUsed(game, micah, dennis)

    expect(micah.bonusPoints).toBe(3)
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('chapel-a039')
    expect(card.cost).toEqual({ wood: 3, clay: 2 })
    expect(card.vps).toBe(3)
  })
})
