const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Bean Counter (OccD 158)', () => {
  test('initializes food counter to 0 on play', () => {
    const card = res.getCardById('bean-counter-d158')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.onPlay(game, dennis)

    expect(card.food).toBe(0)
  })

  test('adds 1 food when using action space from rounds 1-8', () => {
    const card = res.getCardById('bean-counter-d158')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.food = 0
    game.getActionSpaceRound = () => 5

    card.onAction(game, dennis, 'some-action')

    expect(card.food).toBe(1)
  })

  test('gives 3 food when counter reaches 3', () => {
    const card = res.getCardById('bean-counter-d158')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    card.food = 2
    game.getActionSpaceRound = () => 5

    card.onAction(game, dennis, 'some-action')

    expect(dennis.food).toBe(3)
    expect(card.food).toBe(0)
  })

  test('does not add food for action spaces from rounds 9+', () => {
    const card = res.getCardById('bean-counter-d158')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.food = 0
    game.getActionSpaceRound = () => 9

    card.onAction(game, dennis, 'some-action')

    expect(card.food).toBe(0)
  })

  test('does not add food for action spaces from round 0', () => {
    const card = res.getCardById('bean-counter-d158')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    card.food = 0
    game.getActionSpaceRound = () => 0

    card.onAction(game, dennis, 'some-action')

    expect(card.food).toBe(0)
  })
})
