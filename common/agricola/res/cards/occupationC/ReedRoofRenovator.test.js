const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Reed Roof Renovator (C144)', () => {
  test('gives 1 reed on play in 3-player game', () => {
    const card = res.getCardById('reed-roof-renovator-c144')
    const game = t.fixture({ cardSets: ['occupationC'], numPlayers: 3 })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.players.count = () => 3
    game.log = { add: jest.fn() }

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(1)
  })

  test('does not give reed on play in non-3-player game', () => {
    const card = res.getCardById('reed-roof-renovator-c144')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0
    game.players.count = () => 2

    card.onPlay(game, dennis)

    expect(dennis.reed).toBe(0)
  })

  test('gives 1 reed when another player renovates', () => {
    const card = res.getCardById('reed-roof-renovator-c144')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.reed = 0
    game.log = { add: jest.fn() }

    card.onAnyRenovate(game, micah, dennis)

    expect(dennis.reed).toBe(1)
  })

  test('does not give reed when card owner renovates', () => {
    const card = res.getCardById('reed-roof-renovator-c144')
    const game = t.fixture({ cardSets: ['occupationC'] })
    game.run()

    const dennis = t.player(game)
    dennis.reed = 0

    card.onAnyRenovate(game, dennis, dennis)

    expect(dennis.reed).toBe(0)
  })
})
