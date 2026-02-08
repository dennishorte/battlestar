const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Casual Worker (OccD 149)', () => {
  test('offers choice when another player uses take-stone-1', () => {
    const card = res.getCardById('casual-worker-d149')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerCasualWorkerChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-stone-1', dennis)

    expect(game.actions.offerCasualWorkerChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('offers choice when another player uses take-stone-2', () => {
    const card = res.getCardById('casual-worker-d149')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerCasualWorkerChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-stone-2', dennis)

    expect(game.actions.offerCasualWorkerChoice).toHaveBeenCalledWith(dennis, card)
  })

  test('does not trigger when card owner uses quarry', () => {
    const card = res.getCardById('casual-worker-d149')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerCasualWorkerChoice: jest.fn() }

    card.onAnyAction(game, dennis, 'take-stone-1', dennis)

    expect(game.actions.offerCasualWorkerChoice).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('casual-worker-d149')
    const game = t.fixture({ cardSets: ['occupationD'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    game.actions = { offerCasualWorkerChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerCasualWorkerChoice).not.toHaveBeenCalled()
  })
})
