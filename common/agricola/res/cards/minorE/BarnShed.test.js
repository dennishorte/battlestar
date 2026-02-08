const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Barn Shed (E066)', () => {
  test('gives 1 grain when another player uses Forest', () => {
    const card = res.getCardById('barn-shed-e066')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.grain = 0

    card.onAnyAction(game, dennis, micah, 'forest')

    expect(dennis.grain).toBe(1)
  })

  test('does not give grain when owner uses Forest', () => {
    const card = res.getCardById('barn-shed-e066')
    const game = t.fixture({ cardSets: ['minorE'] })
    game.run()

    const dennis = t.player(game)
    dennis.grain = 0

    card.onAnyAction(game, dennis, dennis, 'forest')

    expect(dennis.grain).toBe(0)
  })

  test('does not give grain for other actions', () => {
    const card = res.getCardById('barn-shed-e066')
    const game = t.fixture({ cardSets: ['minorE'], numPlayers: 2 })
    game.run()

    const dennis = t.player(game, 'dennis')
    const micah = t.player(game, 'micah')
    dennis.grain = 0

    card.onAnyAction(game, dennis, micah, 'day-laborer')

    expect(dennis.grain).toBe(0)
  })
})
