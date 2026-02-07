const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Sculpture Course (B053)', () => {
  test('offers exchange at end of non-harvest round with wood', () => {
    const card = res.getCardById('sculpture-course-b053')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.stone = 0
    game.isHarvestRound = jest.fn().mockReturnValue(false)
    game.actions.offerSculptureCourse = jest.fn()

    card.onRoundEnd(game, dennis, 3)

    expect(game.actions.offerSculptureCourse).toHaveBeenCalledWith(dennis, card)
  })

  test('offers exchange at end of non-harvest round with stone', () => {
    const card = res.getCardById('sculpture-course-b053')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.stone = 1
    game.isHarvestRound = jest.fn().mockReturnValue(false)
    game.actions.offerSculptureCourse = jest.fn()

    card.onRoundEnd(game, dennis, 3)

    expect(game.actions.offerSculptureCourse).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer at end of harvest round', () => {
    const card = res.getCardById('sculpture-course-b053')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 1
    dennis.stone = 1
    game.isHarvestRound = jest.fn().mockReturnValue(true)
    game.actions.offerSculptureCourse = jest.fn()

    card.onRoundEnd(game, dennis, 4)

    expect(game.actions.offerSculptureCourse).not.toHaveBeenCalled()
  })

  test('does not offer without wood or stone', () => {
    const card = res.getCardById('sculpture-course-b053')
    const game = t.fixture({ cardSets: ['minorB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    dennis.stone = 0
    game.isHarvestRound = jest.fn().mockReturnValue(false)
    game.actions.offerSculptureCourse = jest.fn()

    card.onRoundEnd(game, dennis, 3)

    expect(game.actions.offerSculptureCourse).not.toHaveBeenCalled()
  })

  test('costs 1 grain', () => {
    const card = res.getCardById('sculpture-course-b053')
    expect(card.cost).toEqual({ grain: 1 })
  })
})
