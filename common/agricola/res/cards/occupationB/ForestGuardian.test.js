const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Forest Guardian (B138)', () => {
  test('gives 2 wood on play', () => {
    const card = res.getCardById('forest-guardian-b138')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.wood = 0

    card.onPlay(game, dennis)

    expect(dennis.wood).toBe(2)
  })

  test('transfers 1 food from acting player when they take 5+ wood', () => {
    const card = res.getCardById('forest-guardian-b138')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3
    game.getAccumulatedResources = jest.fn().mockReturnValue({ wood: 5 })

    card.onAnyBeforeAction(game, micah, 'take-wood', dennis)

    expect(micah.food).toBe(2)
    expect(dennis.food).toBe(1)
  })

  test('does not transfer food when wood is less than 5', () => {
    const card = res.getCardById('forest-guardian-b138')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3
    game.getAccumulatedResources = jest.fn().mockReturnValue({ wood: 4 })

    card.onAnyBeforeAction(game, micah, 'take-wood', dennis)

    expect(micah.food).toBe(3)
    expect(dennis.food).toBe(0)
  })

  test('does not trigger when card owner takes wood', () => {
    const card = res.getCardById('forest-guardian-b138')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3
    game.getAccumulatedResources = jest.fn().mockReturnValue({ wood: 5 })

    card.onAnyBeforeAction(game, dennis, 'take-wood', dennis)

    expect(dennis.food).toBe(3)
  })

  test('does not trigger for non-wood actions', () => {
    const card = res.getCardById('forest-guardian-b138')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3
    game.getAccumulatedResources = jest.fn().mockReturnValue({ wood: 5 })

    card.onAnyBeforeAction(game, micah, 'take-clay', dennis)

    expect(micah.food).toBe(3)
  })
})
