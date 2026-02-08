const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Stagehand (OccA 150)', () => {
  test('offers build choice when another player uses traveling players', () => {
    const card = res.getCardById('stagehand-a150')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerBuildChoice: jest.fn() }

    card.onAnyAction(game, micah, 'traveling-players', dennis)

    expect(game.actions.offerBuildChoice).toHaveBeenCalledWith(
      dennis, card, ['fences', 'stables', 'rooms']
    )
  })

  test('does not trigger when card owner uses traveling players', () => {
    const card = res.getCardById('stagehand-a150')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    game.actions = { offerBuildChoice: jest.fn() }

    card.onAnyAction(game, dennis, 'traveling-players', dennis)

    expect(game.actions.offerBuildChoice).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('stagehand-a150')
    const game = t.fixture({ cardSets: ['occupationA'] })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')
    game.actions = { offerBuildChoice: jest.fn() }

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(game.actions.offerBuildChoice).not.toHaveBeenCalled()
  })
})
