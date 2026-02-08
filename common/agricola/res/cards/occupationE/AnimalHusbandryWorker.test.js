const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Animal Husbandry Worker (E136)', () => {
  test('gives 4 wood and offers build fences when 9+ rounds left', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 5 // 9 rounds left

    const dennis = t.player(game)
    dennis.wood = 0

    const offerBuildFences = jest.fn()
    game.actions.offerBuildFences = offerBuildFences

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(4)
    expect(offerBuildFences).toHaveBeenCalledWith(dennis, card)
  })

  test('gives 3 wood when 6-8 rounds left', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 8 // 6 rounds left

    const dennis = t.player(game)
    dennis.wood = 0

    game.actions.offerBuildFences = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(3)
  })

  test('gives 2 wood when 3-5 rounds left', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 11 // 3 rounds left

    const dennis = t.player(game)
    dennis.wood = 0

    game.actions.offerBuildFences = jest.fn()

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('gives no wood when less than 3 rounds left', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()
    game.state.round = 13 // 1 round left

    const dennis = t.player(game)
    dennis.wood = 0

    const offerBuildFences = jest.fn()
    game.actions.offerBuildFences = offerBuildFences

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(0)
    expect(offerBuildFences).not.toHaveBeenCalled()
  })

  test('gives end game points to players with most pastures', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.getPastureCount = () => 3
    micah.getPastureCount = () => 2

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(2)
    expect(bonuses.micah).toBeUndefined()
  })

  test('gives end game points to multiple players tied for most pastures', () => {
    const card = res.getCardById('animal-husbandry-worker-e136')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    dennis.getPastureCount = () => 3
    micah.getPastureCount = () => 3

    const bonuses = card.getEndGamePointsAllPlayers(game)

    expect(bonuses.dennis).toBe(2)
    expect(bonuses.micah).toBe(2)
  })
})
