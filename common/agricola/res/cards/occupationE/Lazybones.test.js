const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Lazybones (E148)', () => {
  test('initializes stables on specified action spaces', () => {
    const card = res.getCardById('lazybones-e148')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    const dennis = t.player(game)

    card.onPlay(game, dennis)

    expect(card.stables['take-grain']).toBe(true)
    expect(card.stables['plow-field']).toBe(true)
    expect(card.stables['day-laborer']).toBe(true)
    expect(card.stables['build-rooms']).toBe(true)
  })

  test('builds free stable when another player uses marked action space', () => {
    const card = res.getCardById('lazybones-e148')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.stables = {
      'take-grain': true,
      'plow-field': true,
      'day-laborer': true,
      'build-rooms': true,
    }

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    const buildFreeStable = jest.fn()
    game.actions.buildFreeStable = buildFreeStable

    card.onAnyAction(game, micah, 'take-grain', dennis)

    expect(buildFreeStable).toHaveBeenCalledWith(dennis, card)
    expect(card.stables['take-grain']).toBeUndefined()
  })

  test('does not build stable when card owner uses action space', () => {
    const card = res.getCardById('lazybones-e148')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.stables = {
      'take-grain': true,
    }

    const dennis = t.player(game)

    const buildFreeStable = jest.fn()
    game.actions.buildFreeStable = buildFreeStable

    card.onAnyAction(game, dennis, 'take-grain', dennis)

    expect(buildFreeStable).not.toHaveBeenCalled()
    expect(card.stables['take-grain']).toBe(true)
  })

  test('does not build stable for action spaces without markers', () => {
    const card = res.getCardById('lazybones-e148')
    const game = t.fixture({ cardSets: ['occupationE'] })
    game.run()

    card.stables = {
      'take-grain': true,
    }

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')

    const buildFreeStable = jest.fn()
    game.actions.buildFreeStable = buildFreeStable

    card.onAnyAction(game, micah, 'forest', dennis)

    expect(buildFreeStable).not.toHaveBeenCalled()
  })
})
