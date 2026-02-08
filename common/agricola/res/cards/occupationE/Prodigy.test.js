const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Prodigy (E098)', () => {
  test('gives bonus points for improvements when this is 1st occupation', () => {
    const card = res.getCardById('prodigy-e098')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1
    dennis.getAllImprovements = () => [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    dennis.bonusPoints = 0

    card.onPlay(game, dennis)

    expect(dennis.bonusPoints).toBe(3)
  })

  test('does not give bonus points when this is not 1st occupation', () => {
    const card = res.getCardById('prodigy-e098')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 2
    dennis.getAllImprovements = () => [{ id: 'a' }, { id: 'b' }]
    dennis.bonusPoints = 0

    card.onPlay(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('gives 0 bonus points when no improvements', () => {
    const card = res.getCardById('prodigy-e098')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    dennis.getOccupationCount = () => 1
    dennis.getAllImprovements = () => []
    dennis.bonusPoints = 0

    card.onPlay(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })
})
