const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Reader (OccD 085)', () => {
  test('initializes providesRoom to false', () => {
    const card = res.getCardById('reader-d085')
    expect(card.providesRoom).toBe(false)
  })

  test('checkRoomCondition returns true when player has 6+ occupations in non-draft', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 6

    expect(card.checkRoomCondition(dennis, false)).toBe(true)
  })

  test('checkRoomCondition returns false when player has less than 6 occupations in non-draft', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 5

    expect(card.checkRoomCondition(dennis, false)).toBe(false)
  })

  test('checkRoomCondition returns true when player has 7+ occupations in draft', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 7

    expect(card.checkRoomCondition(dennis, true)).toBe(true)
  })

  test('checkRoomCondition returns false when player has 6 occupations in draft', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 6

    expect(card.checkRoomCondition(dennis, true)).toBe(false)
  })

  test('activates room when playing occupation reaches 6 occupations', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()
    game.isDraftVariant = false

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 6
    card.providesRoom = false

    card.onPlayOccupation(game, dennis)

    expect(card.providesRoom).toBe(true)
  })

  test('does not re-activate if already providing room', () => {
    const card = res.getCardById('reader-d085')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()
    game.isDraftVariant = false

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 6
    card.providesRoom = true

    // Should not log again
    card.onPlayOccupation(game, dennis)

    expect(card.providesRoom).toBe(true)
  })
})
