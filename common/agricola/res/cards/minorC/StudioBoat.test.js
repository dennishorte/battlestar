const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Studio Boat (C039)', () => {
  test('has providesActionSpace flag', () => {
    const card = res.getCardById('studio-boat-c039')
    expect(card.providesActionSpace).toBe(true)
  })

  test('has correct actionSpaceId', () => {
    const card = res.getCardById('studio-boat-c039')
    expect(card.actionSpaceId).toBe('studio-boat')
  })

  test('provides action space for 1-3 players', () => {
    const card = res.getCardById('studio-boat-c039')
    expect(card.actionSpaceForPlayerCount).toEqual([1, 2, 3])
  })

  test('gives bonus point on traveling-players action', () => {
    const card = res.getCardById('studio-boat-c039')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.onAction(game, dennis, 'traveling-players')

    expect(dennis.bonusPoints).toBe(1)
  })

  test('accumulates bonus points on multiple uses', () => {
    const card = res.getCardById('studio-boat-c039')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 2

    card.onAction(game, dennis, 'traveling-players')

    expect(dennis.bonusPoints).toBe(3)
  })

  test('does not trigger on other actions', () => {
    const card = res.getCardById('studio-boat-c039')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.bonusPoints = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.bonusPoints).toBe(0)
  })
})
