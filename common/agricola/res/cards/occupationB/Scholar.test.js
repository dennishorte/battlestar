const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Scholar (B097)', () => {
  test('offers play occupation or minor improvement when in stone house', () => {
    const card = res.getCardById('scholar-b097')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'stone'
    game.actions = { offerScholarPlay: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerScholarPlay).toHaveBeenCalledWith(dennis, card)
  })

  test('does not offer when not in stone house', () => {
    const card = res.getCardById('scholar-b097')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'clay'
    game.actions = { offerScholarPlay: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerScholarPlay).not.toHaveBeenCalled()
  })

  test('does not offer when in wood house', () => {
    const card = res.getCardById('scholar-b097')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.roomType = 'wood'
    game.actions = { offerScholarPlay: jest.fn() }

    card.onRoundStart(game, dennis)

    expect(game.actions.offerScholarPlay).not.toHaveBeenCalled()
  })
})
