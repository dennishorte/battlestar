const t = require('../testutil.js')
const { Galaxy } = require('../model/Galaxy.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

function findAdjacent(game, systemId) {
  const galaxy = new Galaxy(game)
  const adjacent = galaxy.getAdjacent(systemId)
  return adjacent[0]
}

describe('Tactical Action Step Tracker', () => {
  test('step is set to activate after system activation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const target = findAdjacent(game, 'sol-home')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: target })

    // After activation but before movement completes, step should be 'move'
    // (move step starts immediately after activation)
    expect(game.state.currentTacticalAction.step).toBe('move')
  })

  test('step is null after tactical action completes', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['cruiser'],
            'jord': ['space-dock'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const target = findAdjacent(game, 'sol-home')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: target })
    t.choose(game, 'Done')  // skip movement

    // After tactical action completes, step should be null
    expect(game.state.currentTacticalAction.step).toBeNull()
  })

  test('step tracks through full tactical action flow', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        units: {
          'sol-home': {
            space: ['cruiser', 'cruiser'],
            'jord': ['space-dock', 'infantry', 'infantry'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const target = findAdjacent(game, 'sol-home')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: target })

    // Move ships to activated system
    t.action(game, 'move-ships', {
      movements: [
        { unitType: 'cruiser', from: 'sol-home', count: 1 },
      ],
    })

    // After full tactical action completes, step should be null
    expect(game.state.currentTacticalAction.step).toBeNull()
  })

  test('currentTacticalAction includes step field on creation', () => {
    const game = t.fixture()
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    const target = findAdjacent(game, 'sol-home')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: target })

    // Verify the step field exists on currentTacticalAction
    expect(game.state.currentTacticalAction).toHaveProperty('step')
    expect(game.state.currentTacticalAction.activatingPlayer).toBe('dennis')
    expect(game.state.currentTacticalAction.systemId).toBe(target)
  })
})
