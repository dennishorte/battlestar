const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Profiteering (E082)', () => {
  test('gives 1 food on play', () => {
    const card = res.getCardById('profiteering-e082')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onPlay(game, dennis)

    expect(dennis.food).toBe(1)
  })

  test('offers resource exchange after day-laborer action', () => {
    const card = res.getCardById('profiteering-e082')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let exchangeOffered = false
    game.actions.offerResourceExchange = (player, sourceCard, fromType, toType, amount) => {
      exchangeOffered = true
      expect(player).toBe(dennis)
      expect(sourceCard).toBe(card)
      expect(fromType).toBe('building')
      expect(toType).toBe('building')
      expect(amount).toBe(1)
    }

    card.onAction(game, dennis, 'day-laborer')

    expect(exchangeOffered).toBe(true)
  })

  test('does not offer exchange for other actions', () => {
    const card = res.getCardById('profiteering-e082')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)

    let exchangeOffered = false
    game.actions.offerResourceExchange = () => {
      exchangeOffered = true
    }

    card.onAction(game, dennis, 'take-wood')

    expect(exchangeOffered).toBe(false)
  })
})
