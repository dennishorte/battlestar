const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Gardening Head Official (OccD 135)', () => {
  test('gives 4 wood when played with 9+ rounds left', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 5 // 14 - 5 = 9 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
  })

  test('gives 3 wood when played with 6-8 rounds left', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 8 // 14 - 8 = 6 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when played with 3-5 rounds left', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 11 // 14 - 11 = 3 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives no wood when played with less than 3 rounds left', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0
    game.state.round = 12 // 14 - 12 = 2 rounds left

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
  })

  test('gives 2 bonus points to player with most vegetables in fields', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.getVegetablesInFields = () => 3
    micah.getVegetablesInFields = () => 2

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(2)
    expect(bonuses.micah).toBeUndefined()
  })

  test('gives 2 bonus points to all players tied for most vegetables in fields', () => {
    const card = res.getCardById('gardening-head-official-d135')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.getVegetablesInFields = () => 3
    micah.getVegetablesInFields = () => 3

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(2)
    expect(bonuses.micah).toBe(2)
  })
})
