const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Entrepreneur (E162)', () => {
  test('initializes food to 0 on play', () => {
    const card = res.getCardById('entrepreneur-e162')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.food).toBe(0)
  })

  test('offers choice at round start', () => {
    const card = res.getCardById('entrepreneur-e162')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    const offerEntrepreneurChoice = jest.fn()
    game.actions.offerEntrepreneurChoice = offerEntrepreneurChoice

    card.onRoundStart(game, dennis)

    expect(offerEntrepreneurChoice).toHaveBeenCalledWith(dennis, card)
  })
})
