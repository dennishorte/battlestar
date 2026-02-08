const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Begging Student (OccD 097)', () => {
  test('gives 1 begging marker on play', () => {
    const card = res.getCardById('begging-student-d097')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.beggingMarkers = 0

    card.onPlay(game, dennis)

    expect(dennis.beggingMarkers).toBe(1)
  })

  test('adds to existing begging markers on play', () => {
    const card = res.getCardById('begging-student-d097')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.beggingMarkers = 2

    card.onPlay(game, dennis)

    expect(dennis.beggingMarkers).toBe(3)
  })

  test('offers free occupation at harvest start', () => {
    const card = res.getCardById('begging-student-d097')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerFreeOccupation: jest.fn() }

    card.onHarvestStart(game, dennis)

    expect(game.actions.offerFreeOccupation).toHaveBeenCalledWith(dennis, card)
  })
})
