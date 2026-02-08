const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Junior Artist (B152)', () => {
  test('offers use of Traveling Players or Lessons when using Day Laborer with food', () => {
    const card = res.getCardById('junior-artist-b152')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpaceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerUseOtherSpaceChoice).toHaveBeenCalledWith(
      dennis, card, ['traveling-players', 'lessons-1', 'lessons-2'], { cost: { food: 1 } }
    )
  })

  test('only offers unoccupied action spaces', () => {
    const card = res.getCardById('junior-artist-b152')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn((actionId) => actionId === 'traveling-players')
    game.actions = { offerUseOtherSpaceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerUseOtherSpaceChoice).toHaveBeenCalledWith(
      dennis, card, ['lessons-1', 'lessons-2'], { cost: { food: 1 } }
    )
  })

  test('does not offer when no food', () => {
    const card = res.getCardById('junior-artist-b152')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpaceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerUseOtherSpaceChoice).not.toHaveBeenCalled()
  })

  test('does not offer when all spaces are occupied', () => {
    const card = res.getCardById('junior-artist-b152')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(true)
    game.actions = { offerUseOtherSpaceChoice: jest.fn() }

    card.onAction(game, dennis, 'day-laborer')

    expect(game.actions.offerUseOtherSpaceChoice).not.toHaveBeenCalled()
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('junior-artist-b152')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 2
    game.isActionOccupied = jest.fn().mockReturnValue(false)
    game.actions = { offerUseOtherSpaceChoice: jest.fn() }

    card.onAction(game, dennis, 'take-wood')

    expect(game.actions.offerUseOtherSpaceChoice).not.toHaveBeenCalled()
  })
})
