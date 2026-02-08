const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Roof Examiner (OccD 145)', () => {
  test('gives 2 reed when player has 1 major improvement', () => {
    const card = res.getCardById('roof-examiner-d145')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getMajorImprovementCount = () => 1

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(2)
  })

  test('gives 3 reed when player has 2 major improvements', () => {
    const card = res.getCardById('roof-examiner-d145')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getMajorImprovementCount = () => 2

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(3)
  })

  test('gives 4 reed when player has 3 major improvements', () => {
    const card = res.getCardById('roof-examiner-d145')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getMajorImprovementCount = () => 3

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(4)
  })

  test('gives 5 reed when player has 4 major improvements', () => {
    const card = res.getCardById('roof-examiner-d145')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getMajorImprovementCount = () => 4

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(5)
  })

  test('gives 0 reed when player has no major improvements', () => {
    const card = res.getCardById('roof-examiner-d145')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    dennis.getMajorImprovementCount = () => 0

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(0)
  })
})
