const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Swimming Class', () => {
  test('gives 2 bonus points per newborn when used fishing', () => {
    const card = res.getCardById('swimming-class-a035')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['swimming-class-a035'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.usedFishingThisRound = true
    dennis.getNewbornsReturningHome = () => 1

    card.onReturnHome(game, dennis)

    expect(dennis.bonusPoints).toBe(2)
  })

  test('scales with multiple newborns', () => {
    const card = res.getCardById('swimming-class-a035')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['swimming-class-a035'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.usedFishingThisRound = true
    dennis.getNewbornsReturningHome = () => 3

    card.onReturnHome(game, dennis)

    expect(dennis.bonusPoints).toBe(6)
  })

  test('does not trigger without fishing', () => {
    const card = res.getCardById('swimming-class-a035')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['swimming-class-a035'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.usedFishingThisRound = false
    dennis.getNewbornsReturningHome = () => 2

    card.onReturnHome(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })

  test('does not trigger with zero newborns', () => {
    const card = res.getCardById('swimming-class-a035')
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        minorImprovements: ['swimming-class-a035'],
        occupations: ['test-occupation-1', 'test-occupation-2'],
      },
    })
    game.run()

    const dennis = t.dennis(game)
    dennis.usedFishingThisRound = true
    dennis.getNewbornsReturningHome = () => 0

    card.onReturnHome(game, dennis)

    expect(dennis.bonusPoints).toBe(0)
  })
})
